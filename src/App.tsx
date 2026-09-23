import componentUsage from "./component-usage.generated.json";
import { FixtureEditor } from "./FixtureEditor";
import {
  variationsFor,
  itemDetails,
  componentPositioning,
  initialFixture,
  viewports,
  dimension,
  normalizeSearch,
  type Fixture,
} from "./workbench";
import { useRef, useState, useEffect, useMemo, type CSSProperties } from "react";
import { ArrowUpRight, Share2, RotateCcw, Monitor, RotateCw, Search, X, Copy, Check } from "lucide-react";
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
const screenDescriptions: Record<string, string> = {
  home: "Visão geral do responsável, com novidades do feed e os próximos atendimentos.",
  agenda: "Consulta dos atendimentos por data, com informações de horário, profissional e local.",
  contents: "Conteúdos e orientações para acompanhar o desenvolvimento do paciente.",
  metrics: "Acompanhamento da evolução do paciente ao longo dos atendimentos.",
  settings: "Dados do perfil e preferências de uso do aplicativo.",
  login: "Acesso do responsável ao aplicativo por CPF e senha.",
  feed: "Registros de atividades do paciente, com fotos, vídeos e descrições.",
  notifications: "Avisos e atualizações para o responsável.",
};
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
  ["CAvatarUpdater", "Seletor de perfis", "avatars/avatar_updater.dart", "Configurações"],
  ["CAppBarRow", "Cabeçalho com retorno", "app_bars/app_bar_row.dart", "Configurações"],
  ["CButtonBack", "Voltar", "buttons/button_back.dart", "Configurações"],
  ["CText", "Texto", "texts/text.dart", "Configurações"],
  ["CHeader", "Título de seção", "headers/header.dart", "Configurações"],
  ["CCardList", "Cartão de lista", "cards/card_list.dart", "Configurações"],
  ["CScaffold", "Estrutura da tela", "scaffolds/scaffold.dart", "Configurações"],
  ["CAvatar", "Avatar", "avatars/avatar.dart", "Card de atendimento e outros componentes"],
  ["CChip", "Chip", "chips/chip.dart", "Card de atendimento"],
  ["CDivider", "Divisória", "dividers/divider.dart", "Card de atendimento"],
  [
    "CButton",
    "Botões",
    "buttons/button.dart",
    "Login, cabeçalhos e Biblioteca",
  ],
];
function SidebarTabs({ label, value, items, onChange }: {
  label: string;
  value: string;
  items: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return <nav className="ds-shared-tabs" aria-label={label}>
    {items.map((item) => <button key={item.value} type="button"
      aria-pressed={value === item.value}
      className={value === item.value ? "active" : ""}
      onClick={() => onChange(item.value)}>{item.label}</button>)}
  </nav>;
}

export default function App() {
  const params = new URLSearchParams(location.search);
  const [screen, setScreen] = useState(params.get("screen") || "home");
  const [activeScreen, setActiveScreen] = useState(screen);
  const [view, setView] = useState(params.get("view") || "canvas");
  const [sidebarWidths, setSidebarWidths] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("bloomy-sidebar-widths") || "{}");
      return { left: Number.isFinite(saved.left) ? Math.max(220, Math.min(480, saved.left)) : 300,
        right: Number.isFinite(saved.right) ? Math.max(220, Math.min(480, saved.right)) : 300 };
    } catch { return { left: 300, right: 300 }; }
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [resizingSidebar, setResizingSidebar] = useState<string | null>(null);
  useEffect(() => {
    const resize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  useEffect(() => {
    try { localStorage.setItem("bloomy-sidebar-widths", JSON.stringify(sidebarWidths)); } catch { /* Storage may be unavailable. */ }
  }, [sidebarWidths]);
  const sidebarMax = Math.max(220, Math.min(480, Math.floor((windowWidth - 420) / 2)));
  const sidebarWidth = (side: "left" | "right") => Math.min(sidebarMax, sidebarWidths[side]);
  const resizeSidebar = (side: "left" | "right", value: number) =>
    setSidebarWidths(current => ({ ...current, [side]: Math.max(220, Math.min(sidebarMax, value)) }));
  const sidebarHandle = (side: "left" | "right") => <div
    className={`ds-sidebar-resizer ds-sidebar-resizer-${side}`}
    role="separator" aria-orientation="vertical" tabIndex={0}
    aria-label={`Largura da lateral ${side === "left" ? "esquerda" : "direita"}`}
    aria-valuemin={220} aria-valuemax={sidebarMax} aria-valuenow={sidebarWidth(side)}
    title="Arraste para ajustar a largura. Duplo clique para restaurar."
    onDoubleClick={() => resizeSidebar(side, 300)}
    onPointerDown={event => {
      if (event.button !== 0) return;
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      setResizingSidebar(side);
    }}
    onPointerMove={event => {
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        resizeSidebar(side, side === "left" ? event.clientX : window.innerWidth - event.clientX);
    }}
    onPointerUp={event => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
      setResizingSidebar(null);
    }}
    onLostPointerCapture={() => setResizingSidebar(null)}
    onKeyDown={event => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const delta = (event.key === "ArrowRight" ? 10 : -10) * (side === "left" ? 1 : -1);
      resizeSidebar(side, event.key === "Home" ? 220 : event.key === "End" ? sidebarMax : sidebarWidth(side) + delta);
    }} />;
  const [revision, setRevision] = useState(0);
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
  const [vp, setVp] = useState(viewports[params.get("viewport") || ""] ? params.get("viewport")! : "mobile");
  const [width, setWidth] = useState(
    dimension(params.get("w"), viewports[vp]?.width || 402, 320, 1920),
  );
  const [height, setHeight] = useState(
    dimension(params.get("h"), viewports[vp]?.height || 874, 480, 1600),
  );
  const [hoverEnabled, setHoverEnabled] = useState(params.get("hover") === "1");
  const [zoom, setZoom] = useState(dimension(params.get("zoom"), 100, 25, 150));
  const safe = vp === "mobile" || vp === "max";
  const fluid = vp === "fluid";
  const displayZoom = fluid ? 100 : zoom;
  useEffect(() => {
    if (!fluid || !previewArea.current) return;
    const area = previewArea.current;
    const resize = () => {
      const rect = area.getBoundingClientRect();
      setWidth(Math.max(1, Math.floor(rect.width)));
      setHeight(Math.max(1, Math.floor(window.innerHeight - rect.top)));
    };
    const observer = new ResizeObserver(resize);
    observer.observe(area);
    window.addEventListener("resize", resize);
    resize();
    return () => { observer.disconnect(); window.removeEventListener("resize", resize); };
  }, [fluid, view]);
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
    hover: hoverEnabled ? "1" : "0",
  });
  const previewUrl = "/flutter/index.html?" + fixtureQuery;
  // Fixture changes travel over the bridge; only navigation/reset remounts Flutter.
  const frameUrl = useMemo(() => previewUrl, [screen, view, focus, safe, revision, hoverEnabled]);
  const latestFixture = useRef(fixture.data);
  latestFixture.current = fixture.data;
  function sendFixture() {
    frame.current?.contentWindow?.postMessage(
      JSON.stringify({ type: "bloomy-fixture", data: latestFixture.current }),
      location.origin,
    );
  }
  useEffect(() => { sendFixture(); }, [fixture.data]);
  const matches = (...texts: string[]) =>
    normalizeSearch(texts.join(" ")).includes(normalizeSearch(query));
  function applyFixture(id: string, data: Fixture) {
    setFixture({ id, data, error: "" });
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
  const [copiedLink, setCopiedLink] = useState(false);
  useEffect(() => {
    setCopiedLink(false);
  }, [exportText]);
  useEffect(() => {
    if (!copiedLink) return;
    const timer = setTimeout(() => { setCopiedLink(false); }, 2000);
    return () => clearTimeout(timer);
  }, [copiedLink]);
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
    u.searchParams.set("hover", hoverEnabled ? "1" : "0");
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
    hoverEnabled,
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
        if (data.type === "bloomy-ready") sendFixture();
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
  function exportReview() {
    setExportText(location.href);
  }
  const c = components.find((c) => c[0] === focus)!;
  return (
    <div className={`ds${resizingSidebar ? " ds-resizing" : ""}`} style={{
      "--sidebar-left": `${sidebarWidth("left")}px`,
      "--sidebar-right": `${sidebarWidth("right")}px`,
    } as CSSProperties}>
      {sidebarHandle("left")}
      {view !== "handoff" && sidebarHandle("right")}
      <aside className="ds-sidebar">
        <a className="ds-brand" href="/">
          <span>b.</span>
          <div>
            bloomy<small>DESIGN SPACE</small>
          </div>
        </a>
        <SidebarTabs label="Catálogo" value={view === "library" ? "library" : "canvas"}
          items={[{value: "canvas", label: "Telas"}, {value: "library", label: "Componentes"}]}
          onChange={(value) => {setView(value); setQuery(""); setPanel("fixtures");}} />
        <label className="ds-search">
          <Search size={15} aria-hidden="true" />
          <input
            ref={searchRef}
            type="search"
            placeholder="Buscar…"
            aria-label={view === "library" ? "Buscar componentes" : "Buscar telas"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-keyshortcuts="Meta+K Control+K"
          />
          <kbd aria-hidden="true">⌘K</kbd>
        </label>
        {view !== "library" && (
          <div className="ds-pages">
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
          Flutter 3.44.9<p>components_bloomy 6.39.0</p>
          <button className="ds-text-button" onClick={() => setView("handoff")}>
            Sobre este ambiente
          </button>
        </footer>
      </aside>
      <main className={`ds-main${view !== "handoff" ? " ds-main-with-inspector" : ""}`}>
        <header className="ds-top">
<div className="ds-toolbar">

                  <label>
                    Viewport
                    <select
                      aria-label="Preset de viewport"
                      value={vp}
                      onChange={(e) => {
                        setVp(e.target.value);
                        if (viewports[e.target.value] && e.target.value !== "fluid") {
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
                    title="Abrir prévia em nova aba"
                  >
                    <Monitor size={16} />
                  </a>
                  <button
                    className="ds-text-button"
                    disabled={fluid}
                    aria-label="Girar orientação da prévia"
                    title="Girar orientação da prévia"
                    onClick={() => {
                      setWidth(height);
                      setHeight(width);
                    }}
                  >
                    <RotateCw size={16} />
                  </button>
                  <label>
                    Zoom
                    <select
                      aria-label="Zoom da prévia"
                      value={displayZoom}
                      disabled={fluid}
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
                  <label className="ds-hover-toggle">
                    <input type="checkbox" role="switch" aria-label="Hover na prévia" checked={hoverEnabled} onChange={event => setHoverEnabled(event.target.checked)} />
                    <span>Hover</span>
                  </label>
                </div>

          <button className="ds-button" onClick={exportReview}>
            <Share2 size={15} />
            Compartilhar
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
                  sintéticos. Os avatares podem mostrar iniciais ou as fotos
                  de demonstração fornecidas. A moldura simula a área segura do telefone.
                </p>
                <p>
                  Login e permissões são demonstrações locais, sem conexão com
                  o backend clínico. Geometria, cores e tipografia foram
                  conferidas com as gravações do aplicativo.
                </p>
                <p>
                  O vídeo mostra 1.10.3+89; o código disponível é 1.11.3+94.
                  Diferenças de versão estão documentadas.
                </p>
              </article>
              <article>
                <h2>Revisar e entregar</h2>
                <p>
                  Salve as alterações em Git e gere o
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

              </article>
            </div>
          </section>
        ) : (
          <>
            <div className="ds-canvas">
              <section className="ds-stage">
                <div className={`ds-preview-scroll${fluid ? " ds-preview-fluid" : ""}`} ref={previewArea}>
                  <div
                    className="ds-preview-size"
                    style={{
                      width: (width * displayZoom) / 100,
                      height: (height * displayZoom) / 100,
                    }}
                  >
                    <div
                      className="ds-device"
                      style={{
                        width,
                        height,
                        transform: `scale(${displayZoom / 100})`,
                        transformOrigin: "top left",
                        borderRadius: safe ? 35 : 0,
                      }}
                    >
                      <iframe
                        ref={frame}
                        key={`${screen}-${view}-${revision}`}
                        src={frameUrl}
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
                <header className="ds-inspector-heading">
                  <h2>{view === "library" ? focus : screens.find((s) => s[0] === activeScreen)?.[1] || activeScreen}</h2>
                  <p>{view === "library" ? `${c[1]}. Usado em ${c[3]}.` : screenDescriptions[activeScreen] || "Detalhes e opções da tela selecionada."}</p>
                </header>
                <SidebarTabs label="Painel da prévia" value={panel}
                  items={[{value: "fixtures", label: "Variações"}, {value: "context", label: "Informações"}]}
                  onChange={setPanel} />
                {fixture.error && <p role="alert">{fixture.error}</p>}
                {panel === "fixtures" ? (
                  <>

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
                    onOpenComponent={openComponent}
                  />
                  <button
                    className="ds-button ds-reset-preview"
                    title="Reiniciar prévia"
                    aria-label="Reiniciar prévia"
                    onClick={() => {
                      setScreen(activeScreen);
                      setRevision((r) => r + 1);
                    }}
                  >
                    <RotateCcw size={15} />
                    Reiniciar prévia
                  </button>
                  </>
                ) : (
                  <>
                    <h3>Sobre {view === "library" ? "o componente" : "a tela"}</h3>
                    <p>{itemDetails[target]}</p>
                    {view === "library" && <><h3>Posicionamento</h3><p>{componentPositioning[focus]}</p></>}
                    <h3>{view === "library" ? "Onde é usado" : "Componentes desta tela"}</h3>
                    <ul className="ds-component-usage">
                      {view === "library" ? screens.filter(([id]) => ((componentUsage as Record<string, string[]>)[focus] || []).includes(id)).map(([id, label]) => <li key={id}>
                        <button className="ds-text-button" onClick={() => {
                          setScreen(id); setActiveScreen(id); setView("canvas"); setPanel("fixtures"); setQuery("");
                        }}>{label} <ArrowUpRight size={14} /></button>
                      </li>) : components.filter(([id]) => ((componentUsage as Record<string, string[]>)[id] || []).includes(activeScreen)).map(([id, label]) => <li key={id}>
                        <button className="ds-text-button" onClick={() => openComponent(id)}>{label} <ArrowUpRight size={14} /></button>
                      </li>)}
                    </ul>
                    <h3>Origem do código</h3>
                    <code>{view !== "library" || focus === "FeedSection" || focus === "AppointmentsSection" ? "flutter_preview/lib/main.dart" : `lib/src/widgets/${c[2]}`}</code>
                    {view === "library" && <a className="ds-source" href="https://gitea.sidedoor.tech/bloomy/-/packages/pub/components_bloomy/6.39.0" target="_blank" rel="noreferrer">components_bloomy 6.39.0 ↗</a>}
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
          <header className="ds-export-header">
            <h2 id="export-title">Compartilhar prévia</h2>
            <button className="ds-icon-button" aria-label="Fechar compartilhamento" title="Fechar" onClick={() => setExportText("")}>
              <X size={20} />
            </button>
          </header>
          <p>Compartilhe esta prévia com as variações e o viewport selecionados.</p>
          <div className="ds-share-summary">
            <strong>{view === "library" ? focus : screens.find(([id]) => id === activeScreen)?.[1]}</strong>
            <span>{view === "library" ? "Componente" : "Tela"} · {viewports[vp].label} · Zoom {displayZoom}%</span>
          </div>
          <label className="ds-share-link-label" htmlFor="preview-share-url">Link da prévia</label>
          <input id="preview-share-url" className="ds-share-url" readOnly value={exportText} onFocus={event => event.target.select()} />
          {["localhost", "127.0.0.1", "::1", "[::1]"].includes(location.hostname) && <p className="ds-share-local">Este link é local e só abre neste computador. Depois da publicação, ele usará o endereço do site.</p>}
          <div className="ds-export-actions">
            <button className={`ds-button ds-copy-link${copiedLink ? " is-copied" : ""}`} onClick={async () => {
              try { await navigator.clipboard.writeText(exportText); setCopiedLink(true); }
              catch { setStatus("Copie o endereço do navegador para compartilhar."); }
            }}>
              {copiedLink ? <Check size={16} /> : <Copy size={16} />}
              <span aria-live="polite">{copiedLink ? "Copiado" : "Copiar link"}</span>
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
