import { FixtureEditor } from "./FixtureEditor";
import {
  variationsFor,
  initialFixture,
  viewports,
  dimension,
  normalizeSearch,
  type Fixture,
} from "./workbench";
import { useRef, useState, useEffect } from "react";
import { ArrowUpRight, Download, RotateCcw } from "lucide-react";
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
    "FeedSection",
    "Feed · seção",
    "cards/card_feed.dart",
    "Composição da Home e Feed",
  ],
  ["CCardFeed", "Post do feed", "cards/card_feed.dart", "Início e Feed"],
  [
    "AppointmentsSection",
    "Próximos atendimentos · seção",
    "tiles/tile_schedule_parent.dart",
    "Composição da Home e Agenda",
  ],
  [
    "CTileScheduleParent",
    "Atendimento",
    "tiles/tile_schedule_parent.dart",
    "Início e Agenda",
  ],
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
  const [panel, setPanel] = useState("fixtures");
  const [focus, setFocus] = useState(
    components.some((c) => c[0] === params.get("component"))
      ? params.get("component")!
      : "CAppBarUser2",
  );
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const previewArea = useRef<HTMLDivElement>(null);
  const [fixture, setFixture] = useState(() => initialFixture(params));
  const [vp, setVp] = useState(params.get("viewport") || "mobile");
  const [width, setWidth] = useState(
    dimension(params.get("w"), viewports[vp]?.width || 402, 320, 1920),
  );
  const [height, setHeight] = useState(
    dimension(params.get("h"), viewports[vp]?.height || 874, 480, 1600),
  );
  const [zoom, setZoom] = useState(dimension(params.get("zoom"), 100, 25, 150));
  const [safe, setSafe] = useState(params.get("safe") !== "0");
  const target = view === "library" ? focus : activeScreen;
  useEffect(() => {
    if (
      fixture.id !== "custom" &&
      !variationsFor(target).includes(fixture.id)
    ) {
      setScreen(activeScreen);
      setFixture((current) => ({ ...current, id: "custom" }));
    }
  }, [target, fixture.id, activeScreen]);
  const fixtureQuery = new URLSearchParams({
    screen: view === "library" ? "library" : screen,
    component: view === "library" ? focus : "",
    data: JSON.stringify(fixture.data),
    safe: safe ? "1" : "0",
  });
  const previewUrl = "/flutter/index.html?" + fixtureQuery;
  const matches = (...texts: string[]) =>
    normalizeSearch(texts.join(" ")).includes(normalizeSearch(query));
  function applyFixture(id: string, data: Fixture) {
    setScreen(activeScreen);
    setFixture({ id, data, error: "" });
    setRevision((r) => r + 1);
  }
  function openComponent(id: string) {
    setFocus(id);
    setView("library");
    setPanel("fixtures");
    setQuery("");
  }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, []);
  const [exportText, setExportText] = useState("");
  const [status, setStatus] = useState("");
  const frame = useRef<HTMLIFrameElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const u = new URL(location.href);
    u.searchParams.set("screen", activeScreen);
    u.searchParams.set("view", view);
    u.searchParams.set("component", focus);
    u.searchParams.set("fixture", fixture.id);
    if (fixture.id === "custom")
      u.searchParams.set("data", JSON.stringify(fixture.data));
    else u.searchParams.delete("data");
    u.searchParams.set("viewport", vp);
    u.searchParams.set("w", String(width));
    u.searchParams.set("h", String(height));
    u.searchParams.set("zoom", String(zoom));
    u.searchParams.set("safe", safe ? "1" : "0");
    history.replaceState({}, "", u);
  }, [
    screen,
    activeScreen,
    view,
    focus,
    fixture,
    vp,
    width,
    height,
    zoom,
    safe,
  ]);
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
      `# Revisão — Bloomy Flutter\n\nContexto: ${location.href}\n\nStatus: candidata, sem aprovação humana.\nPacote: components_bloomy 6.39.0.\nFonte do app: a61a468.\n\n## Comentários\n${notes.map((n) => `- [${n.done ? "x" : " "}] ${n.screen}: ${n.text}`).join("\n")}\n\n## Limites\nDados e avatares sintéticos. Sem autenticação, envio de arquivos ou backend. Gravação mostra app 1.10.3+89; código consultado é 1.11.3+94. Paridade avaliada visualmente, não certificada pixel a pixel. Contratos, vídeo e integrações ainda fora do recorte.\n\nVersão exata e diferenças: npm run handoff -- baseline\n`,
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
        <nav className="ds-catalog-tabs" aria-label="Catálogo">
          <button
            aria-pressed={view !== "library"}
            className={view !== "library" ? "active" : ""}
            onClick={() => {
              setView("canvas");
              setQuery("");
              setPanel("fixtures");
            }}
          >
            Telas
          </button>
          <button
            aria-pressed={view === "library"}
            className={view === "library" ? "active" : ""}
            onClick={() => {
              setView("library");
              setQuery("");
              setPanel("fixtures");
            }}
          >
            Componentes
          </button>
        </nav>
        <label className="ds-search">
          <span>
            {view === "library" ? "Buscar componentes" : "Buscar telas"}
          </span>
          <input
            ref={searchRef}
            type="search"
            placeholder="Buscar… ⌘K"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-keyshortcuts="Meta+K Control+K"
          />
        </label>
        {view !== "library" && (
          <div className="ds-pages">
            <p className="ds-label">TELAS DO APP REAL</p>
            {screens
              .filter(([id, label]) => matches(id, label))
              .map(([id, label]) => (
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
                    setPanel("fixtures");
                  }}
                >
                  <span className="ds-dot" />
                  {label}
                </button>
              ))}
            {query && !screens.some((s) => matches(...s)) && (
              <p role="status">Nenhuma tela encontrada.</p>
            )}
          </div>
        )}
        {view === "library" && (
          <div className="ds-component-nav">
            <p className="ds-label">COMPONENTES</p>
            {components
              .filter((c) => matches(...c))
              .map((c) => (
                <button
                  key={c[0]}
                  className={
                    view === "library" && focus === c[0] ? "selected" : ""
                  }
                  onClick={() => openComponent(c[0])}
                >
                  <strong>{c[0]}</strong>
                  <small>{c[1]}</small>
                </button>
              ))}
            {query && !components.some((c) => matches(...c)) && (
              <p role="status">Nenhum resultado.</p>
            )}
          </div>
        )}
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
                  ? focus
                  : "Revisão & handoff"}
            </strong>
          </div>
          <button className="ds-text-button" onClick={() => setView("handoff")}>
            Revisão & handoff
          </button>
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
                  <label>
                    Viewport
                    <select
                      aria-label="Preset de viewport"
                      value={vp}
                      onChange={(e) => {
                        setVp(e.target.value);
                        if (viewports[e.target.value]) {
                          setWidth(viewports[e.target.value].width);
                          setHeight(viewports[e.target.value].height);
                        }
                      }}
                    >
                      {Object.entries(viewports).map(([id, v]) => (
                        <option key={id} value={id}>
                          {v.label}
                        </option>
                      ))}
                      {vp === "custom" && (
                        <option value="custom">
                          {width} × {height}
                        </option>
                      )}
                    </select>
                  </label>
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Abrir prévia Flutter isolada"
                  >
                    <ArrowUpRight size={16} />
                  </a>
                  <button
                    className="ds-text-button"
                    onClick={() => {
                      setVp("custom");
                      setWidth(Math.max(320, Math.min(1920, height)));
                      setHeight(Math.max(480, Math.min(1600, width)));
                    }}
                  >
                    Girar
                  </button>
                  <label>
                    Zoom
                    <select
                      aria-label="Zoom da prévia"
                      value={zoom}
                      onChange={(e) => setZoom(Number(e.target.value))}
                    >
                      {[...new Set([25, 50, 75, 100, 125, 150, zoom])]
                        .sort((a, b) => a - b)
                        .map((z) => (
                          <option key={z} value={z}>
                            {z}%
                          </option>
                        ))}
                    </select>
                  </label>
                  <button
                    className="ds-text-button"
                    onClick={() => {
                      const area = previewArea.current?.getBoundingClientRect();
                      if (area)
                        setZoom(
                          Math.max(
                            25,
                            Math.min(
                              100,
                              Math.floor(
                                Math.min(
                                  (area.width - 40) / width,
                                  (window.innerHeight -
                                    Math.max(0, area.top) -
                                    24) /
                                    height,
                                ) * 100,
                              ),
                            ),
                          ),
                        );
                    }}
                  >
                    Ajustar à área
                  </button>
                  <label>
                    <input
                      type="checkbox"
                      checked={safe}
                      onChange={(e) => {
                        setScreen(activeScreen);
                        setSafe(e.target.checked);
                      }}
                    />
                    Moldura iPhone
                  </label>
                  <button
                    className="ds-text-button"
                    title="Reiniciar prévia"
                    aria-label="Reiniciar prévia"
                    onClick={() => {
                      setScreen(activeScreen);
                      setRevision((r) => r + 1);
                    }}
                  >
                    <RotateCcw size={15} />
                  </button>
                  <button
                    className="ds-text-button"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(location.href);
                        setStatus("Link do ambiente copiado.");
                      } catch {
                        setStatus(
                          "Copie o endereço do navegador para compartilhar.",
                        );
                      }
                    }}
                  >
                    Copiar link
                  </button>
                </div>
                <div className="ds-preview-scroll" ref={previewArea}>
                  <div
                    className="ds-preview-size"
                    style={{
                      width: (width * zoom) / 100,
                      height: (height * zoom) / 100,
                    }}
                  >
                    <div
                      className="ds-device"
                      style={{
                        width,
                        height,
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: "top left",
                        borderRadius: safe ? 35 : 0,
                      }}
                    >
                      <iframe
                        ref={frame}
                        key={`${screen}-${view}-${revision}`}
                        src={previewUrl}
                        title="App Bloomy em Flutter"
                      />
                      {safe && (
                        <>
                          <div className="ds-ios" aria-hidden="true">
                            <span>13:05</span>
                            <i />
                            <span className="ds-ios-icons">
                              <svg width="18" height="14" viewBox="0 0 18 14">
                                <path
                                  fill="currentColor"
                                  d="M0 9h3v5H0zm5-3h3v8H5zm5-3h3v11h-3zm5-3h3v14h-3z"
                                />
                              </svg>
                              <svg width="18" height="14" viewBox="0 0 18 14">
                                <path
                                  fill="currentColor"
                                  d="M9 14 6.5 11.5a3.5 3.5 0 0 1 5 0ZM4.5 9.5l-2-2a9.2 9.2 0 0 1 13 0l-2 2a6.3 6.3 0 0 0-9 0ZM0 5l2 2a10 10 0 0 1 14 0l2-2A12.8 12.8 0 0 0 0 5Z"
                                />
                              </svg>
                              <svg width="27" height="14" viewBox="0 0 27 14">
                                <rect
                                  x=".5"
                                  y=".5"
                                  width="23"
                                  height="13"
                                  rx="3"
                                  fill="none"
                                  stroke="currentColor"
                                  opacity=".4"
                                />
                                <rect
                                  x="2.5"
                                  y="2.5"
                                  width="19"
                                  height="9"
                                  rx="1.5"
                                  fill="currentColor"
                                />
                                <path
                                  d="M25 4v6c2-1 2-5 0-6"
                                  fill="currentColor"
                                  opacity=".5"
                                />
                              </svg>
                            </span>
                          </div>
                          <div
                            className="ds-home-indicator"
                            aria-hidden="true"
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </section>
              <aside className="ds-inspector">
                <div className="ds-panel-tabs">
                  <button
                    className={panel === "fixtures" ? "active" : ""}
                    onClick={() => setPanel("fixtures")}
                  >
                    Variações
                  </button>
                  <button
                    className={panel === "context" ? "active" : ""}
                    onClick={() => setPanel("context")}
                  >
                    Informações
                  </button>
                  <button
                    className={panel === "notes" ? "active" : ""}
                    onClick={() => setPanel("notes")}
                  >
                    Comentários ({notes.length})
                  </button>
                </div>
                {fixture.error && <p role="alert">{fixture.error}</p>}
                {panel === "fixtures" ? (
                  <FixtureEditor
                    target={target}
                    label={
                      view === "library"
                        ? focus
                        : screens.find((s) => s[0] === activeScreen)?.[1] ||
                          activeScreen
                    }
                    id={fixture.id}
                    data={fixture.data}
                    onApply={applyFixture}
                  />
                ) : panel === "notes" ? (
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
                      onChange={(e) => openComponent(e.target.value)}
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
