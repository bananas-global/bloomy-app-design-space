import { useRef, useState, useEffect } from "react";
import {
  Smartphone,
  Component,
  GitBranch,
  ArrowUpRight,
  Download,
  RotateCcw,
} from "lucide-react";
import "./native-space.css";
const screens = [
  ["home", "Início"],
  ["agenda", "Agenda"],
  ["contents", "Conteúdos"],
  ["metrics", "Evolutivo"],
  ["settings", "Configurações"],
  ["login", "Login"],
  ["feed", "Feed"],
  ["notifications", "Notificações"],
] as const;
const components = [
  [
    "CAppBarUser2",
    "Cabeçalho",
    "app_bars/app_bar_user.dart",
    "Início, Agenda, Conteúdos, Evolutivo",
  ],
  [
    "CBottomBarUser",
    "Navegação",
    "bottom_bars/bottom_bar_user.dart",
    "Todas as áreas autenticadas",
  ],
  [
    "CCalendarWeekly",
    "Calendário",
    "calendars/calendar_weekly.dart",
    "Agenda · mês e semana",
  ],
  [
    "CTextField",
    "Campos e busca",
    "texts/text_field.dart",
    "Agenda, Conteúdos, Login",
  ],
  [
    "CContainerListInformation",
    "Estados vazios",
    "containers/container_list_information.dart",
    "Início, Agenda e Feed",
  ],
  [
    "CTileParentContent",
    "Conteúdo educativo",
    "tiles/tile_parent_content.dart",
    "Conteúdos e Biblioteca",
  ],
  [
    "CTileSettings",
    "Configuração",
    "tiles/tile_settings.dart",
    "Configurações",
  ],
  [
    "CButton",
    "Botões",
    "buttons/button.dart",
    "Login, cabeçalhos e Biblioteca",
  ],
];
type Note = { text: string; screen: string; done: boolean };
function initialNotes(): Note[] {
  try {
    const n = JSON.parse(localStorage.getItem("native-review-v1") || "[]");
    return Array.isArray(n)
      ? n.filter(
          (v) =>
            typeof v.text === "string" &&
            typeof v.screen === "string" &&
            typeof v.done === "boolean",
        )
      : [];
  } catch {
    return [];
  }
}
export default function App() {
  const params = new URLSearchParams(location.search);
  const [screen, setScreen] = useState(params.get("screen") || "home");
  const [activeScreen, setActiveScreen] = useState(screen);
  const [view, setView] = useState(params.get("view") || "canvas");
  const [revision, setRevision] = useState(0);
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [draft, setDraft] = useState("");
  const [panel, setPanel] = useState("context");
  const [focus, setFocus] = useState("CAppBarUser2");
  const [exportText, setExportText] = useState("");
  const [status, setStatus] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set("screen", screen);
    u.searchParams.set("view", view);
    history.replaceState({}, "", u);
  }, [screen, view]);
  useEffect(() => {
    if (exportText) dialog.current?.showModal();
    else dialog.current?.close();
  }, [exportText]);
  useEffect(() => {
    setActiveScreen(screen);
  }, [screen]);
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (
        event.origin !== location.origin ||
        event.source !== frame.current?.contentWindow ||
        typeof event.data !== "string"
      )
        return;
      try {
        const data = JSON.parse(event.data);
        if (
          data.type === "bloomy-screen" &&
          typeof data.screen === "string" &&
          data.screen.length < 40
        )
          setActiveScreen(data.screen);
      } catch {}
    };
    addEventListener("message", onMessage);
    return () => removeEventListener("message", onMessage);
  }, []);
  function save(n: Note[]) {
    setNotes(n);
    try {
      localStorage.setItem("native-review-v1", JSON.stringify(n));
    } catch {
      setStatus(
        "Exporte a revisão: o navegador não conseguiu salvar os comentários.",
      );
    }
  }
  function exportReview() {
    setExportText(
      `# Revisão — Bloomy Flutter\n\nStatus: candidata, sem aprovação humana.\nPacote: components_bloomy 6.39.0.\nFonte do app: a61a468.\n\n## Comentários\n${notes.map((n) => `- [${n.done ? "x" : " "}] ${n.screen}: ${n.text}`).join("\n")}\n\n## Limites\nDados e avatares sintéticos. Sem autenticação, envio de arquivos ou backend. Gravação mostra app 1.10.3+89; código consultado é 1.11.3+94. Paridade avaliada visualmente, não certificada pixel a pixel. Contratos, vídeo e integrações ainda fora do recorte.\n\nVersão exata e diferenças: npm run handoff -- baseline\n`,
    );
  }
  const c = components.find((c) => c[0] === focus)!;
  return (
    <div className="ds">
      <aside className="ds-sidebar">
        <a className="ds-brand" href="/">
          <span>b.</span>
          <div>
            bloomy<small>DESIGN SPACE</small>
          </div>
        </a>
        <p className="ds-label">APP DOS RESPONSÁVEIS</p>
        <nav>
          {[
            ["canvas", "Área de criação", Smartphone],
            ["library", "Biblioteca Flutter", Component],
            ["handoff", "Revisão & handoff", GitBranch],
          ].map(([id, label, Icon]) => (
            <button
              key={id as string}
              className={view === id ? "active" : ""}
              onClick={() => setView(id as string)}
            >
              {typeof Icon !== "string" && <Icon size={17} />}
              <span>{label as string}</span>
            </button>
          ))}
        </nav>
        <div className="ds-pages">
          <p className="ds-label">TELAS DO APP REAL</p>
          {screens.map(([id, label]) => (
            <button
              key={id}
              className={
                activeScreen === id && view === "canvas" ? "selected" : ""
              }
              onClick={() => {
                setScreen(id);
                setActiveScreen(id);
                setRevision((r) => r + 1);
                setView("canvas");
              }}
            >
              <span className="ds-dot" />
              {label}
            </button>
          ))}
        </div>
        <footer>
          <span className="ds-dot live" />
          Flutter 3.44.9<p>components_bloomy 6.39.0</p>
          <small>Ambiente local · dados sintéticos</small>
        </footer>
      </aside>
      <main className="ds-main">
        <header className="ds-top">
          <div>
            Bloomy App <span>/</span>{" "}
            <strong>
              {view === "canvas"
                ? screens.find((s) => s[0] === activeScreen)?.[1] || screen
                : view === "library"
                  ? "Biblioteca original"
                  : "Revisão & handoff"}
            </strong>
          </div>
          <span className="ds-badge">Candidata · não aprovada</span>
          <button className="ds-button" onClick={exportReview}>
            <Download size={15} />
            Exportar revisão
          </button>
        </header>
        {view === "handoff" ? (
          <section className="ds-document">
            <p className="ds-label">CÓDIGO ORIGINAL, EXPERIMENTAÇÃO LOCAL</p>
            <h1>Do app real para o Design Space.</h1>
            <p>
              A prévia agora é Flutter e importa a biblioteca original. A
              composição fica no projeto e pode ser alterada com Git; não é um
              preview externo.
            </p>
            <div className="ds-doc-grid">
              <article>
                <h2>O que é compartilhado</h2>
                <p>
                  Tema, fontes, ícones e widgets vêm de components_bloomy
                  6.39.0. Cabeçalhos, busca, calendário, navegação, cartões e
                  controles são os componentes reais.
                </p>
                <code>flutter_preview/lib/main.dart</code>
                <p>
                  As amostras da biblioteca importam os mesmos widgets das
                  telas.
                </p>
              </article>
              <article>
                <h2>O que foi adaptado</h2>
                <p>
                  Managers, autenticação, rede e permissões nativas foram
                  substituídos por estado local. Avatares e dados são
                  sintéticos. A moldura simula a área segura do telefone.
                </p>
                <p>
                  O vídeo mostra 1.10.3+89; o código disponível é 1.11.3+94.
                  Diferenças de versão estão documentadas.
                </p>
              </article>
              <article>
                <h2>Revisar e entregar</h2>
                <p>
                  Registre os comentários, salve as alterações em Git e gere o
                  pacote com commit exato, fontes e patch.
                </p>
                <code>npm run handoff -- baseline</code>
                <p>
                  A aprovação humana deve registrar pessoa, escopo e commit no
                  HANDOFF.md. Nenhuma aprovação automática.
                </p>
              </article>
              <article>
                <h2>Pendências explícitas</h2>
                <p>
                  Integrações, documentos legais completos, vídeo e dados
                  clínicos não são simulados como produção. As gravações não
                  mostram atendimentos preenchidos ou devolutivas.
                </p>
                <p>
                  Comentários são locais e exportáveis; não há sincronização
                  entre revisores.
                </p>
              </article>
            </div>
          </section>
        ) : (
          <>
            <section className="ds-title">
              <div>
                <p className="ds-label">
                  {view === "library"
                    ? "MESMO PACOTE, MESMOS WIDGETS"
                    : "REFERÊNCIA: GRAVAÇÕES DO APLICATIVO"}
                </p>
                <h1>
                  {view === "library"
                    ? "Biblioteca Flutter original"
                    : "O app real, no espaço de criação."}
                </h1>
                <p>
                  Componentes originais · composição editável · dados locais
                </p>
              </div>
              <button
                className="ds-text-button"
                onClick={() => setRevision((r) => r + 1)}
              >
                <RotateCcw size={15} />
                Reiniciar prévia
              </button>
            </section>
            <div className="ds-canvas">
              <section className="ds-stage">
                <div className="ds-toolbar">
                  <label>
                    Tela{" "}
                    <select
                      aria-label="Tela da prévia"
                      value={
                        view === "library"
                          ? "library"
                          : screens.some((s) => s[0] === activeScreen)
                            ? activeScreen
                            : screen
                      }
                      onChange={(e) => {
                        setScreen(e.target.value);
                        setActiveScreen(e.target.value);
                        setRevision((r) => r + 1);
                        setView("canvas");
                      }}
                    >
                      {screens.map(([id, label]) => (
                        <option value={id} key={id}>
                          {label}
                        </option>
                      ))}
                      {view === "library" && (
                        <option value="library">Biblioteca</option>
                      )}
                    </select>
                  </label>
                  <span>402 × 874 · iPhone</span>
                  <a
                    href={`/flutter/index.html?screen=${view === "library" ? "library" : screen}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Abrir prévia Flutter isolada"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                </div>
                <div className="ds-device">
                  <iframe
                    ref={frame}
                    key={`${screen}-${view}-${revision}`}
                    src={`/flutter/index.html?screen=${view === "library" ? "library" : screen}`}
                    title="App Bloomy em Flutter"
                  />
                  <div className="ds-ios" aria-hidden="true">
                    <span>13:05</span>
                    <i />
                    <span>▮▮▮ ▰</span>
                  </div>
                  <div className="ds-home-indicator" aria-hidden="true" />
                </div>
                <p className="ds-caption">
                  Flutter real · sem conexão com dados clínicos
                </p>
              </section>
              <aside className="ds-inspector">
                <div className="ds-panel-tabs">
                  <button
                    className={panel === "context" ? "active" : ""}
                    onClick={() => setPanel("context")}
                  >
                    Componentes
                  </button>
                  <button
                    className={panel === "notes" ? "active" : ""}
                    onClick={() => setPanel("notes")}
                  >
                    Comentários ({notes.length})
                  </button>
                </div>
                {panel === "notes" ? (
                  <>
                    <h2>
                      Revisar {screens.find((s) => s[0] === activeScreen)?.[1]}
                    </h2>
                    <p>
                      Comentários guardados neste navegador. Exporte para
                      compartilhar.
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (draft.trim()) {
                          save([
                            ...notes,
                            {
                              text: draft.trim(),
                              screen: activeScreen,
                              done: false,
                            },
                          ]);
                          setDraft("");
                        }
                      }}
                    >
                      <label htmlFor="review-note">Comentário</label>
                      <textarea
                        id="review-note"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        required
                        placeholder="O que difere do app real?"
                      />
                      <button className="ds-button primary">
                        Adicionar comentário
                      </button>
                    </form>
                    {notes.map((n, i) => (
                      <article className="ds-note" key={i}>
                        <small>{n.screen}</small>
                        <p
                          style={{
                            textDecoration: n.done ? "line-through" : "none",
                          }}
                        >
                          {n.text}
                        </p>
                        <button
                          className="ds-text-button"
                          onClick={() =>
                            save(
                              notes.map((v, j) =>
                                j === i ? { ...v, done: !v.done } : v,
                              ),
                            )
                          }
                        >
                          {n.done ? "Reabrir" : "Resolver"}
                        </button>
                        <button
                          className="ds-text-button"
                          onClick={() => save(notes.filter((_, j) => j !== i))}
                        >
                          Excluir comentário
                        </button>
                      </article>
                    ))}
                  </>
                ) : (
                  <>
                    <span className="ds-native">PACOTE ORIGINAL</span>
                    <h2>O componente é o mesmo.</h2>
                    <p>
                      A prévia usa widgets Dart de{" "}
                      <strong>components_bloomy</strong>, sem recriá-los em CSS.
                    </p>
                    <label className="ds-label" htmlFor="native-component">
                      INSPECIONAR COMPONENTE
                    </label>
                    <select
                      id="native-component"
                      value={focus}
                      onChange={(e) => setFocus(e.target.value)}
                    >
                      {components.map((c) => (
                        <option key={c[0]}>{c[0]}</option>
                      ))}
                    </select>
                    <h3>{c[1]}</h3>
                    <code>lib/src/widgets/{c[2]}</code>
                    <p>Usos: {c[3]}.</p>
                    <p className="ds-small">
                      Fonte no pacote privado instalado. A composição editável
                      está em <code>flutter_preview/lib/main.dart</code>.
                    </p>
                    <button
                      className="ds-text-button"
                      onClick={() => setView("library")}
                    >
                      Abrir amostras reais <ArrowUpRight size={14} />
                    </button>
                    <hr />
                    <h3>Referência e limites</h3>
                    <p>
                      Geometria, cores, tipografia e componentes conferidos com
                      as gravações. Avatares substituídos por iniciais
                      sintéticas.
                    </p>
                    <p>
                      Login e permissões são demonstrações locais. Nenhuma
                      credencial de paciente, arquivo ou notificação é enviada.
                    </p>
                    <a
                      className="ds-source"
                      href="https://gitea.sidedoor.tech/bloomy/-/packages/pub/components_bloomy/6.39.0"
                      target="_blank"
                      rel="noreferrer"
                    >
                      components_bloomy 6.39.0 ↗
                    </a>
                  </>
                )}
              </aside>
            </div>
          </>
        )}
        <dialog
          ref={dialog}
          onCancel={() => setExportText("")}
          className="ds-export"
          aria-labelledby="export-title"
        >
          <h2 id="export-title">Revisão pronta para compartilhar</h2>
          <textarea readOnly aria-label="Texto da revisão" value={exportText} />
          <div>
            <button
              className="ds-button primary"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(exportText);
                  setStatus("Revisão copiada.");
                } catch {
                  setStatus("Selecione o texto e copie pelo teclado.");
                }
              }}
            >
              Copiar revisão
            </button>
            <button className="ds-button" onClick={() => setExportText("")}>
              Fechar exportação
            </button>
          </div>
        </dialog>
        {status && (
          <div className="ds-toast" role="status">
            {status}
            <button aria-label="Fechar aviso" onClick={() => setStatus("")}>
              ×
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
