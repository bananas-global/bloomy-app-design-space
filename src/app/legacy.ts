// Links from the hand-written chrome (`/?view=canvas&screen=agenda&fixture=week`)
// open the matching engine URL (`/agenda?scenario=agenda.week`). Custom `data=`
// links fall back to the screen's default variation.

type Catalog = {
  screens: Set<string>;
  scenarios: Set<string>;
  /** Widget name → catalog id. */
  components: Map<string, string>;
  /** Catalog id → component fixture ids. */
  componentFixtures: Map<string, Set<string>>;
};

export function legacyLocation(pathname: string, search: string, catalog: Catalog): string | undefined {
  const params = new URLSearchParams(search);
  if (pathname !== "/" || !(params.has("view") || params.has("screen"))) return undefined;
  const out = new URLSearchParams();
  const fixture = params.get("fixture") === "reference" ? "default" : params.get("fixture");
  const component = catalog.components.get(params.get("component") ?? "");
  if (params.get("view") === "library" && component) {
    out.set("component", component);
    if (fixture && catalog.componentFixtures.get(component)?.has(fixture)) out.set("fixture", fixture);
  } else {
    const screen = params.get("screen") ?? "";
    const target = catalog.screens.has(screen) ? screen : "home";
    const scenario = `${target}.${fixture ?? "default"}`;
    out.set("scenario", catalog.scenarios.has(scenario) ? scenario : `${target}.default`);
    pathname = `/${target}`;
  }
  // Old links always showed a phone or tablet; "Área livre" maps to the engine's fit.
  const viewport = params.get("viewport");
  if (viewport === "tablet") out.set("viewport", "tablet");
  else if (viewport !== "fluid") out.set("viewport", "mobile");
  return `${pathname}?${out}`;
}
