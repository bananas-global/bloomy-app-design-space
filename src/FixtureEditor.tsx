import { useState, useEffect } from "react";
import { fixtures, parseFixture, type Fixture } from "./workbench";
export function FixtureEditor({
  id,
  data,
  onApply,
}: {
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
          "bloomy-custom-fixture-v1",
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
      <h2>Fixtures</h2>
      <p>Dados sintéticos usados pelas telas e pelas amostras Flutter.</p>
      <label htmlFor="fixture-preset">Conjunto de dados</label>
      <select
        id="fixture-preset"
        value={id}
        onChange={(e) => onApply(e.target.value, fixtures[e.target.value].data)}
      >
        {Object.entries(fixtures).map(([key, f]) => (
          <option key={key} value={key}>
            {f.label}
          </option>
        ))}
        {id === "custom" && <option value="custom">Personalizada</option>}
      </select>
      <p className="ds-fixture-help">
        Nome do responsável: cabeçalho. Paciente e conteúdo:
        Conteúdos/Evolutivo. Botão: amostra CButton. Início e Agenda continuam
        sem atendimentos, como na gravação.
      </p>
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
              const raw = localStorage.getItem("bloomy-custom-fixture-v1");
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
    </section>
  );
}
