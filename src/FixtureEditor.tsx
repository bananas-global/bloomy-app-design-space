import { serializeFixture } from "./workbench";
import { ArrowUpRight } from "lucide-react";
import { useState, useEffect } from "react";
import {
  fixtures,
  componentGroupsFor,
  controlDisabledReason,
  patchComponent,
  sectionState,
  variationsFor,
  parseFixture,
  type Fixture,
} from "./workbench";
export function FixtureEditor({
  target,
  label,
  id,
  data,
  onApply,
  onOpenComponent,
}: {
  onOpenComponent: (component: string) => void;
  target: string;
  label: string;
  id: string;
  data: Fixture;
  onApply: (id: string, data: Fixture) => void;
}) {
  const [draft, setDraft] = useState(JSON.stringify(serializeFixture(data), null, 2));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  useEffect(() => {
    setDraft(JSON.stringify(serializeFixture(data), null, 2));
    setError("");
  }, [data]);
  function apply() {
    try {
      const parsed = parseFixture(draft);
      onApply("custom", parsed);
      try {
        localStorage.setItem(
          `bloomy-custom-fixture-v2:${target}`,
          JSON.stringify(serializeFixture(parsed)),
        );
        setSaved("Fixture aplicada e salva neste navegador.");
      } catch {
        setSaved("Aplicada. O navegador não permitiu salvar.");
      }
      setError("");
    } catch (e) {
      setError((e as Error).message);
    }
  }
  const groups = componentGroupsFor(target);
  return (
    <section className="ds-fixtures" aria-label={label}>
      {groups.map((group) => (
        <div className={`ds-component-controls${group.nested ? " ds-nested-controls" : ""}`} role="group" aria-label={group.title} key={group.title}>
          <div className="ds-component-controls-header">
            <span>{group.title}</span>
            {group.component && <button type="button" className="ds-icon-button" aria-label={`Abrir componente ${group.component}`} title={`Abrir ${group.component}`} onClick={() => { if (group.previewData) onApply("custom", patchComponent(data, { ...group.previewData, ...(["settings", "CAvatarUpdater"].includes(target) && group.component === "CAvatar" && group.previewData.avatarRole === "patient" ? {schedulePatientPhoto: String(data.settingsPatientPhoto)} : {}) })); onOpenComponent(group.component); }}>
              <ArrowUpRight size={16} aria-hidden="true" />
            </button>}
          </div>
          {group.controls.map((control) => {
            const disabledReason = controlDisabledReason(target, group.component, control.field, data);
            const value =
              control.field === "feedState"
                ? sectionState(data, "feed")
                : control.field === "scheduleState"
                  ? sectionState(data, "schedule")
                  : String(data[control.field]);
            return (
              <label key={control.field} title={disabledReason || control.label}>
                <select
                  aria-label={control.label}
                  title={disabledReason || control.label}
                  disabled={!!disabledReason}
                  aria-description={disabledReason}
                  value={value}
                  onChange={(event) =>
                    onApply(
                      "custom",
                      patchComponent(data, {
                        [control.field]:
                          typeof data[control.field] === "boolean"
                            ? event.target.value === "true"
                            : event.target.value,
                      }),
                    )
                  }
                >
                  {!control.options.some(([key]) => key === value) && (
                    <option value={value}>{value}</option>
                  )}
                  {control.options.map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
            );
          })}
          {group.note && <p>{group.note}</p>}
        </div>
      ))}
      {!groups.length && (
        <div className="ds-variation-list" aria-label="Variações disponíveis">
          {variationsFor(target).map((key) => (
            <button
              key={key}
              aria-pressed={id === key}
              className={id === key ? "selected" : ""}
              onClick={() => onApply(key, fixtures[key].data)}
            >
              <span>{fixtures[key].label}</span>
              {id === key && <span aria-hidden="true">✓</span>}
            </button>
          ))}
          {id === "custom" && <p>Personalizada aplicada</p>}
        </div>
      )}
      <details key={target}>
        <summary>Editar dados</summary>
        <label htmlFor="fixture-json">Editar fixture (JSON)</label>
        <textarea
          id="fixture-json"
          spellCheck={false}
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setSaved("");
          }}
        />
        <p role="alert" className="ds-error">
          {error}
        </p>
        <button className="ds-button primary" onClick={apply}>
          Aplicar fixture
        </button>
        <div className="ds-fixture-actions">
          <button
            className="ds-text-button"
            onClick={() => {
              try {
                const raw = localStorage.getItem(
                  `bloomy-custom-fixture-v2:${target}`,
                );
                if (!raw) throw Error("Nenhuma fixture personalizada salva.");
                onApply("custom", parseFixture(raw));
                setSaved("Fixture salva carregada.");
              } catch (e) {
                setError((e as Error).message);
              }
            }}
          >
            Carregar salva
          </button>
          <button
            className="ds-text-button"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(serializeFixture(data), null, 2)], {
                  type: "application/json",
                }),
              );
              const a = document.createElement("a");
              a.href = url;
              a.download = "bloomy-fixture.json";
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Exportar JSON
          </button>
          <button
            className="ds-text-button"
            onClick={() => onApply("default", fixtures.default.data)}
          >
            Restaurar padrões
          </button>
        </div>
        <p role="status">{saved}</p>
      </details>
    </section>
  );
}
