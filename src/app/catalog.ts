// Translates the workbench data (fixtures, variations, control groups) into the
// @brucesantos/design-space contract. No React here, so tests can import it.
import type {
  ComponentPreviewFixture,
  Control,
  ControlGroup,
  Fixture as EngineFixture,
  NetworkState,
  Persona,
  Scenario,
} from "@brucesantos/design-space";
import {
  catalogWidgets,
  componentGroupsFor,
  controlDisabledReason,
  fixtures,
  patchComponent,
  scenarioExpected,
  screens,
  variationsFor,
  type Fixture,
} from "../workbench";

/** The engine rejects empty option values; "" travels in the URL as this. */
export const EMPTY_VALUE = "vazio";
export const encodeValue = (value: string) => (value === "" ? EMPTY_VALUE : value);
export const decodeValue = (value: string) => (value === EMPTY_VALUE ? "" : value);

/** Catalog ids are lowercase kebab-case: CAppBarUser2 → app-bar-user-2. */
export function componentId(widget: string) {
  return widget
    .replace(/^C(?=[A-Z])/, "")
    .replace(/([a-z])([A-Z0-9])/g, "$1-$2")
    .replace(/([0-9])([A-Z])/g, "$1-$2")
    .toLowerCase();
}
export const catalogIds = new Map(catalogWidgets.map(([widget]) => [widget, componentId(widget)]));

const kebab = (value: string) => value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const resolved = (data: Fixture) => patchComponent(data, {}) as Record<string, unknown>;
const shortLabel = (value: string) => (value.length > 48 ? `${value.slice(0, 47)}…` : value);

/** URL values are strings; restore each field's own type from the default fixture. */
function typedValue(field: string, value: string): unknown {
  const current = (fixtures.default.data as Record<string, unknown>)[field];
  if (typeof current === "boolean") return value === "true";
  if (typeof current === "number") return Number(value);
  return decodeValue(value);
}

export function applyControls(data: Fixture, controls: Record<string, string>): Fixture {
  const out: Record<string, unknown> = { ...resolved(data) };
  for (const [field, value] of Object.entries(controls))
    if (field in out) out[field] = typedValue(field, value);
  return out as Fixture;
}

/** The engine's network selector drives the screen's own loading, error and empty states. */
export function applyNetwork(data: Fixture, network: NetworkState): Fixture {
  if (network === "loading" || network === "slow")
    return { ...data, state: "loading", feedState: "loading", scheduleState: "loading" };
  if (network === "error") return { ...data, state: "error", feedState: "error", scheduleState: "error" };
  if (network === "empty") return { ...data, feedState: "empty", scheduleState: "empty", showContent: false };
  return data;
}

export function screenData(fixture: Fixture | undefined, controls: Record<string, string>, network: NetworkState): Fixture {
  return applyNetwork(applyControls(fixture ?? fixtures.default.data, controls), network);
}

/**
 * Control groups of a screen. Options also carry every value the screen's
 * fixtures use, so a variation can pin its data instead of falling back to the
 * first option. The engine never disables an option, so the reasons an option
 * has no effect become the control's description (shown on hover).
 */
export function controlGroupsFor(target: string): ControlGroup[] {
  const variations = variationsFor(target).map((id) => resolved(fixtures[id].data));
  const base = variations[0];
  const seen = new Set<string>();
  return componentGroupsFor(target).map((group, index) => {
    const controls: Control[] = [];
    for (const control of group.controls) {
      const field = String(control.field);
      if (seen.has(field)) continue;
      seen.add(field);
      const options = control.options.map(([value, label]) => ({ value: encodeValue(value), label }));
      for (const data of variations) {
        const value = encodeValue(String(data[field]));
        if (!options.some((option) => option.value === value))
          options.push({ value, label: shortLabel(decodeValue(value) || "Vazio") });
      }
      // Probe each variation, alone and with one control of the group changed,
      // for the reasons this control has no effect.
      const probes = variations.flatMap((data) => [
        data,
        ...group.controls.flatMap((other) =>
          other.options.map(([value]) => ({ ...data, [other.field]: typedValue(String(other.field), value) })),
        ),
      ]);
      const reasons = new Set(
        probes.flatMap((probe) => controlDisabledReason(target, group.component, control.field, probe as Fixture) ?? []),
      );
      controls.push({
        id: field,
        label: control.label,
        options,
        default: encodeValue(String(base[field])),
        ...(reasons.size ? { description: [...reasons].join(" ") } : {}),
      });
    }
    return {
      id: `${catalogIds.get(group.component) ?? "tela"}-${index}`,
      title: group.title,
      component: catalogIds.get(group.component),
      ...(group.note ? { note: group.note } : {}),
      controls,
    };
  });
}

/** Control values a fixture implies on a screen, so the variation pins its own data. */
export function scenarioControls(groups: ControlGroup[], fixtureId: string): Record<string, string> {
  const data = resolved(fixtures[fixtureId].data);
  return Object.fromEntries(groups.flatMap((group) => group.controls.map((control) => [control.id, encodeValue(String(data[control.id]))])));
}

export const screenControls = new Map(screens.map(([screen]) => [screen, controlGroupsFor(screen)]));

export const scenarios: Scenario[] = screens.flatMap(([screen]) =>
  variationsFor(screen).map((fixture) => ({
    id: `${screen}.${fixture}`,
    title: fixtures[fixture].label,
    route: `/${screen}`,
    fixture,
    controls: scenarioControls(screenControls.get(screen)!, fixture),
    expected: scenarioExpected[`${screen}.${fixture}`],
  })),
);

export const engineFixtures: EngineFixture<Fixture>[] = Object.entries(fixtures).map(([id, fixture]) => ({
  id,
  label: fixture.label,
  data: fixture.data,
}));

export const personas: Persona[] = [
  { id: "responsavel", name: "Responsável", goal: "Acompanhar o paciente pelo app.", permissions: [] },
];

/**
 * Isolated components only offer ready-made examples: the widget's presets plus
 * one per control option over the populated fixture, the same cases
 * scripts/generate-variation-cases.mjs sends to the Flutter tests.
 */
export function componentFixtures(widget: string): ComponentPreviewFixture<Fixture>[] {
  const presets = variationsFor(widget).map((id) => ({ id, label: fixtures[id].label, data: fixtures[id].data }));
  const options = componentGroupsFor(widget).flatMap((group) =>
    group.controls.flatMap((control) =>
      control.options.map(([value, label], index) => ({
        id: `${kebab(String(control.field))}-${index}`,
        label: `${control.label}: ${label}`,
        data: patchComponent(fixtures.populated.data, { [control.field]: typedValue(String(control.field), encodeValue(value)) }),
      })),
    ),
  );
  const seen = new Set<string>();
  return [...presets, ...options].filter((fixture) => !seen.has(fixture.id) && seen.add(fixture.id));
}
