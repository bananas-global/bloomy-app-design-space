import { useState, useEffect } from "react";
import {
  fixtures,
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
}: {
  target: string;
  label: string;
  id: string;
  data: Fixture;
  onApply: (id: string, data: Fixture) => void;
}) {
  const [draft, setDraft] = useState(JSON.stringify(data, null, 2));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState("");
  useEffect(() => {
    setDraft(JSON.stringify(data, null, 2));
    setError("");
  }, [data]);
  function apply() {
    try {
      const parsed = parseFixture(draft);
      onApply("custom", parsed);
      try {
        localStorage.setItem(
          `bloomy-custom-fixture-v2:${target}`,
          JSON.stringify(parsed),
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
  return (
    <section className="ds-fixtures">
      <h2>{label}</h2>
      <p>Escolha um estado para explorar. As amostras usam dados sintéticos.</p>
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
                new Blob([JSON.stringify(data, null, 2)], {
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
            onClick={() => onApply("reference", fixtures.reference.data)}
          >
            Restaurar referência
          </button>
        </div>
        <p role="status">{saved}</p>
      </details>
    </section>
  );
}
