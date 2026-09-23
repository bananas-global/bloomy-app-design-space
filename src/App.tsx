import React, { useState, useRef, useEffect } from "react";
import {
  Layers,
  Smartphone,
  Component,
  GitBranch,
  MessageSquare,
  ArrowUpRight,
  MousePointer2,
  Check,
  RotateCcw,
  Download,
  Plus,
  ChevronRight,
} from "lucide-react";
import { FamilyApp } from "./screens/FamilyApp";
import { Button, Avatar, ScheduleCard, Status } from "./components/ui";
import { schedules } from "./data/fixtures";
const source =
  "https://github.com/sidedoor-tech/bloomy_app/blob/a61a468a3339d1f64c64cc5fbd02e0e786f8600f/lib/modules/";
const catalog = [
  {
    name: "Button",
    file: "src/components/ui.tsx",
    flutter: "CButton",
    uses: "Biblioteca, Início, Agenda e detalhes",
    description:
      "Uma única implementação para ações primárias, secundárias e discretas.",
  },
  {
    name: "ScheduleCard",
    file: "src/components/ui.tsx",
    flutter: "CTileScheduleParent",
    uses: "Início e Agenda",
    description:
      "O mesmo atendimento, a mesma composição. A tela fornece dados e a ação de abrir.",
  },
  {
    name: "Avatar",
    file: "src/components/ui.tsx",
    flutter: "CAvatar",
    uses: "Cartões, navegação e detalhes",
    description:
      "Iniciais sintéticas, ligadas ao cadastro central do paciente.",
  },
  {
    name: "Status",
    file: "src/components/ui.tsx",
    flutter: "ScheduleStatus / estilo do tile",
    uses: "Cartões e detalhes",
    description:
      "Agendado e Finalizado são os estados demonstrados neste recorte.",
  },
];
type Note = { text: string; page: string; done: boolean };
function readNotes(): Note[] {
  try {
    const value: unknown = JSON.parse(
      localStorage.getItem("bloomy-review-v1") || "[]",
    );
    return Array.isArray(value)
      ? value.filter(
          (note): note is Note =>
            note &&
            typeof note.text === "string" &&
            typeof note.page === "string" &&
            typeof note.done === "boolean",
        )
      : [];
  } catch {
    return [];
  }
}
export default function App() {
  const initial = new URLSearchParams(location.search);
  const [tab, setTab] = useState(initial.get("view") || "canvas");
  const [page, setPageState] = useState(
    initial.get("screen") === "agenda" ? "agenda" : "home",
  );
  const [patient, setPatient] = useState("all");
  const [day, setDay] = useState(23);
  const [inspect, setInspect] = useState(false);
  const [selected, setSelected] = useState("ScheduleCard");
  const [rounded, setRounded] = useState(false);
  const [notes, setNotes] = useState<Note[]>(readNotes);
  const [draft, setDraft] = useState("");
  const [panel, setPanel] = useState("context");
  const [toast, setToast] = useState("");
  const [exportText, setExportText] = useState("");
  const exportDialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (exportText) exportDialog.current?.showModal();
    else exportDialog.current?.close();
  }, [exportText]);
  function changeTab(value: string) {
    setTab(value);
    const u = new URL(location.href);
    u.searchParams.set("view", value);
    history.replaceState({}, "", u);
  }
  function setPage(value: string) {
    setPageState(value);
    const u = new URL(location.href);
    u.searchParams.set("screen", value);
    history.replaceState({}, "", u);
  }
  function saveNotes(n: Note[]) {
    setNotes(n);
    try {
      localStorage.setItem("bloomy-review-v1", JSON.stringify(n));
    } catch {
      setToast(
        "Não foi possível salvar neste navegador. Exporte os comentários antes de sair.",
      );
    }
  }
  function download() {
    const text = `# Revisão — Bloomy App\n\nStatus: candidata; sem aprovação registrada.\n\n## Comentários\n${notes.map((n) => `- [${n.done ? "x" : " "}] ${n.page}: ${n.text}`).join("\n")}\n\n## Pendências\n- Validar proposta visual com o time.\n- Adaptar widgets Flutter; esta biblioteca é web.\n- Engenharia completa estados de erro, carregamento e integração.\n\nGerar pacote Git: npm run handoff\n`;
    setExportText(text);
  }
  const current = catalog.find((c) => c.name === selected)!;
  return (
    <div
      className="workspace"
      style={
        { "--button-radius": rounded ? "24px" : "12px" } as React.CSSProperties
      }
    >
      <aside className="sidebar">
        <a className="space-brand" href="/">
          <span className="space-mark">b.</span>
          <span>
            bloomy<small>DESIGN SPACE</small>
          </span>
        </a>
        <div className="project-label">
          APP DOS RESPONSÁVEIS <span>01</span>
        </div>
        <nav aria-label="Design Space">
          {[
            { id: "canvas", icon: Smartphone, label: "Área de criação" },
            { id: "library", icon: Component, label: "Biblioteca", count: "4" },
            { id: "handoff", icon: GitBranch, label: "Revisão & handoff" },
          ].map((n) => (
            <button
              key={n.id}
              className={tab === n.id ? "active" : ""}
              onClick={() => changeTab(n.id)}
            >
              <n.icon size={18} />
              {n.label}
              {n.count && <span>{n.count}</span>}
            </button>
          ))}
        </nav>
        <div className="sidebar-section">
          <span>FLUXO EM ESTUDO</span>
          <strong>Acompanhar atendimentos</strong>
          <p>Da próxima sessão à devolutiva.</p>
          <button
            onClick={() => {
              changeTab("canvas");
              setPage("home");
            }}
          >
            <span className="step-number">1</span>Início
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => {
              changeTab("canvas");
              setPage("agenda");
            }}
          >
            <span className="step-number">2</span>Agenda
            <ChevronRight size={14} />
          </button>
          <button
            onClick={() => {
              changeTab("canvas");
              setPage("agenda");
              setDay(22);
            }}
          >
            <span className="step-number">3</span>Devolutiva
            <ChevronRight size={14} />
          </button>
        </div>
        <div className="sidebar-footer">
          <span className="live-dot" /> Ambiente local
          <p>Mock sintético · sem conexão clínica</p>
          <a
            href={source + "schedules/schedules_screen.dart"}
            target="_blank"
            rel="noreferrer"
          >
            Consultar app de origem <ArrowUpRight size={13} />
          </a>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div>
            <span>Bloomy App</span>
            <ChevronRight size={14} />
            <strong>
              {tab === "canvas"
                ? "Acompanhar atendimentos"
                : tab === "library"
                  ? "Biblioteca compartilhada"
                  : "Revisão & handoff"}
            </strong>
          </div>
          <span className="candidate">
            <i />
            Candidata à revisão
          </span>
          <Button variant="secondary" onClick={download}>
            <Download size={15} />
            Exportar revisão
          </Button>
        </header>
        {tab === "canvas" ? (
          <>
            <div className="canvas-title">
              <div>
                <p className="eyebrow">UM ESPAÇO PARA EXPERIMENTAR, JUNTOS</p>
                <h1>Acompanhar atendimentos</h1>
                <p>Uma família. Uma agenda. Componentes que evoluem juntos.</p>
              </div>
              <Button
                variant="ghost"
                onClick={() => {
                  setPatient("all");
                  setDay(23);
                  setPage("home");
                  setRounded(false);
                  setToast("Fluxo reiniciado com os mesmos dados.");
                }}
              >
                <RotateCcw size={16} />
                Reiniciar fluxo
              </Button>
            </div>
            <div className="canvas-layout">
              <div className="stage">
                <div className="stage-toolbar">
                  <div className="segmented">
                    <button
                      className={page === "home" ? "active" : ""}
                      onClick={() => setPage("home")}
                    >
                      Início
                    </button>
                    <button
                      className={page === "agenda" ? "active" : ""}
                      onClick={() => setPage("agenda")}
                    >
                      Agenda
                    </button>
                  </div>
                  <button
                    className={`inspect-toggle ${inspect ? "on" : ""}`}
                    onClick={() => setInspect(!inspect)}
                    aria-pressed={inspect}
                  >
                    <MousePointer2 size={15} />
                    {inspect ? "Inspeção ativa" : "Inspecionar"}
                  </button>
                  <span>390 × 780</span>
                </div>
                <FamilyApp
                  key={page}
                  page={page}
                  onPage={setPage}
                  patient={patient}
                  onPatient={setPatient}
                  day={day}
                  onDay={setDay}
                  inspect={inspect}
                  onInspect={(name) => {
                    setSelected(name);
                    setPanel("component");
                  }}
                />
                <div className="stage-caption">
                  <span className="live-dot" />
                  Prévia interativa · proposta visual sobre fluxo existente
                </div>
              </div>
              <aside className="inspector">
                <div className="panel-tabs">
                  <button
                    className={panel !== "notes" ? "active" : ""}
                    onClick={() => setPanel("context")}
                  >
                    Contexto
                  </button>
                  <button
                    className={panel === "notes" ? "active" : ""}
                    onClick={() => setPanel("notes")}
                  >
                    Comentários <span>{notes.length}</span>
                  </button>
                </div>
                {panel === "notes" ? (
                  <>
                    <h3>Conversa sobre o desenho</h3>
                    <p>
                      Comentários guardados neste navegador. Exporte para
                      compartilhar com o time.
                    </p>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (draft.trim()) {
                          saveNotes([
                            ...notes,
                            { text: draft.trim(), page, done: false },
                          ]);
                          setDraft("");
                        }
                      }}
                    >
                      <label htmlFor="note">
                        Comentário em {page === "home" ? "Início" : "Agenda"}
                      </label>
                      <textarea
                        id="note"
                        placeholder="O que vale ajustar ou decidir?"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        required
                      />
                      <Button type="submit">
                        <Plus size={14} />
                        Adicionar comentário
                      </Button>
                    </form>
                    {notes.map((n, i) => (
                      <div
                        className={`review-note ${n.done ? "resolved" : ""}`}
                        key={i}
                      >
                        <small>{n.page === "home" ? "Início" : "Agenda"}</small>
                        <p>{n.text}</p>
                        <Button
                          variant="ghost"
                          onClick={() =>
                            saveNotes(
                              notes.map((v, j) =>
                                j === i ? { ...v, done: !v.done } : v,
                              ),
                            )
                          }
                        >
                          <Check size={13} />
                          {n.done ? "Reabrir" : "Resolver"}
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="panel-kicker">
                      <Layers size={16} />
                      RECORTE 01
                    </div>
                    <h3>
                      Próximo atendimento,
                      <br />
                      sem perder o contexto.
                    </h3>
                    <p>
                      O responsável consulta os atendimentos, filtra por
                      paciente e abre os detalhes. Sessões finalizadas mostram a
                      devolutiva.
                    </p>
                    <div className="panel-divider" />
                    <label className="field-label" htmlFor="component">
                      COMPONENTE EM FOCO
                    </label>
                    <select
                      id="component"
                      value={selected}
                      onChange={(e) => {
                        setSelected(e.target.value);
                        setPanel("component");
                      }}
                    >
                      {catalog.map((c) => (
                        <option key={c.name}>{c.name}</option>
                      ))}
                    </select>
                    <h4>{current.name}</h4>
                    <p>{current.description}</p>
                    <div className="source-box">
                      <code>{current.file}</code>
                      <span>Usado em {current.uses}</span>
                    </div>
                    <a
                      href={source + "schedules/schedules_screen.dart"}
                      target="_blank"
                      rel="noreferrer"
                      className="source-link"
                    >
                      Flutter: {current.flutter}
                      <ArrowUpRight size={13} />
                    </a>
                    <div className="experiment">
                      <strong>Experimente uma mudança global</strong>
                      <p>
                        Arredondar o Button altera seus usos na prévia,
                        biblioteca e no ambiente.
                      </p>
                      <label className="switch-label">
                        <input
                          type="checkbox"
                          checked={rounded}
                          onChange={(e) => setRounded(e.target.checked)}
                        />
                        Botões arredondados
                      </label>
                      <small>
                        Experimento local. Para manter: src/style.css.
                      </small>
                    </div>
                    <div className="panel-divider" />
                    <h4>Em aberto</h4>
                    <p>
                      Proposta visual ainda não aprovada. O registro de leitura
                      da devolutiva e mapas são simulados.
                    </p>
                    <button
                      className="text-link"
                      onClick={() => changeTab("handoff")}
                    >
                      Ver limites e entrega <ArrowUpRight size={14} />
                    </button>
                  </>
                )}
              </aside>
            </div>
          </>
        ) : tab === "library" ? (
          <section className="page-content">
            <p className="eyebrow">CRIAR A PARTIR DO QUE É COMUM</p>
            <h1>Uma biblioteca. Todas as telas.</h1>
            <p className="lead">
              As amostras abaixo importam as mesmas funções usadas no fluxo.
            </p>
            <div className="library-control">
              <label className="switch-label">
                <input
                  type="checkbox"
                  checked={rounded}
                  onChange={(e) => setRounded(e.target.checked)}
                />
                Experimentar Button arredondado em todos os usos
              </label>
              <code>--button-radius: {rounded ? "24px" : "12px"}</code>
            </div>
            <div className="library-grid">
              {catalog.map((c) => (
                <article className="library-item" key={c.name}>
                  <div className="library-heading">
                    <Component size={18} />
                    <h3>{c.name}</h3>
                    <span>Compartilhado</span>
                  </div>
                  <div className="component-preview">
                    {c.name === "Button" ? (
                      <>
                        <Button
                          onClick={() => setToast("Ação da amostra acionada.")}
                        >
                          Ver atendimento
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setToast("Ação secundária acionada.")}
                        >
                          Voltar
                        </Button>
                      </>
                    ) : c.name === "ScheduleCard" ? (
                      <ScheduleCard
                        schedule={schedules[0]}
                        onOpen={() => {
                          changeTab("canvas");
                          setPage("agenda");
                        }}
                      />
                    ) : c.name === "Avatar" ? (
                      <>
                        <Avatar patientId="p1" />
                        <Avatar patientId="p2" />
                        <Avatar patientId="p1" small />
                      </>
                    ) : (
                      <>
                        <Status status="Agendado" />
                        <Status status="Finalizado" />
                      </>
                    )}
                  </div>
                  <p>{c.description}</p>
                  <code>{c.file}</code>
                  <div className="library-meta">
                    <span>{c.uses}</span>
                    <strong>↳ {c.flutter}</strong>
                  </div>
                </article>
              ))}
            </div>
            <div className="honest-note">
              <strong>Reutilização real dentro deste Design Space.</strong>
              <p>
                O app de produção é Flutter. Esta biblioteca web é uma adaptação
                de apresentação, não o pacote privado components_bloomy. O
                handoff identifica o widget correspondente e o trabalho de
                adaptação.
              </p>
            </div>
          </section>
        ) : (
          <section className="page-content">
            <p className="eyebrow">DO DESENHO À CONVERSA COM ENGENHARIA</p>
            <h1>Uma entrega que explica o que mudou.</h1>
            <p className="lead">
              O Git guarda o desenho. Uma nota curta guarda as decisões.
            </p>
            <div className="handoff-grid">
              <article>
                <span className="candidate">Candidata · não aprovada</span>
                <h2>Acompanhar atendimentos</h2>
                <p>
                  Início → Agenda → Detalhes ou Devolutiva. Seleção de paciente
                  e busca usam a mesma fonte de dados.
                </p>
                <h4>O que existe no produto</h4>
                <ul>
                  <li>Próximos atendimentos no início e agenda com filtro.</li>
                  <li>Detalhes para agendados; devolutiva para finalizados.</li>
                  <li>Ação de mapa e registro de leitura da devolutiva.</li>
                </ul>
                <h4>O que estamos propondo</h4>
                <p>
                  Hierarquia visual, cartões e apresentação simplificada da
                  navegação neste recorte. Não representam uma decisão aprovada
                  de produto.
                </p>
                <a
                  href={source + "home/home_screen.dart"}
                  target="_blank"
                  rel="noreferrer"
                >
                  Referência fixada no código de origem ↗
                </a>
              </article>
              <article>
                <h3>O que a engenharia recebe</h3>
                <ol>
                  <li>
                    <strong>Versão exata</strong>
                    <p>
                      Commit local + arquivo do código gerados pelo comando
                      abaixo.
                    </p>
                  </li>
                  <li>
                    <strong>Diferenças recuperáveis</strong>
                    <p>
                      Patch contra a referência Git escolhida, sem reconstruir o
                      histórico.
                    </p>
                  </li>
                  <li>
                    <strong>Decisões e pendências</strong>
                    <p>HANDOFF.md e comentários exportados para discussão.</p>
                  </li>
                </ol>
                <code className="command">npm run handoff -- baseline</code>
                <p className="subtle">
                  Gera um pacote local. Nenhum envio, publicação ou aprovação
                  automática.
                </p>
              </article>
              <article>
                <h3>Pendências explícitas</h3>
                <ul>
                  <li>Revisão visual e validação com responsáveis.</li>
                  <li>Adaptação para os widgets Flutter existentes.</li>
                  <li>
                    Engenharia completa erros, carregamento, autenticação e
                    integrações.
                  </li>
                  <li>
                    Mapa simulado; leitura da devolutiva não é persistida no
                    backend.
                  </li>
                  <li>Demais áreas do aplicativo fora deste recorte.</li>
                </ul>
              </article>
              <article>
                <h3>Como criar e revisar</h3>
                <p>
                  Peça a alteração na tela ou componente. Edite a biblioteca uma
                  vez, veja o resultado no fluxo e deixe um comentário.
                </p>
                <p>
                  Salve o trabalho em Git. Após aprovação humana, registre
                  aprovador, escopo e commit em HANDOFF.md e crie uma tag
                  apontando para essa versão.
                </p>
                <Button variant="secondary" onClick={download}>
                  <Download size={16} />
                  Baixar comentários ({notes.length})
                </Button>
                <p className="subtle">
                  Colaboração nesta versão: Git + exportação. Comentários não
                  sincronizam entre pessoas.
                </p>
              </article>
            </div>
          </section>
        )}
        <dialog
          className="export-dialog"
          ref={exportDialog}
          onCancel={() => setExportText("")}
          aria-labelledby="export-title"
        >
          <h2 id="export-title">Revisão pronta para compartilhar</h2>
          <p>
            Copie o texto para a conversa do time ou salve o arquivo. Nenhuma
            informação é enviada automaticamente.
          </p>
          <textarea
            aria-label="Texto da revisão"
            readOnly
            value={exportText}
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className="export-actions">
            <Button
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(exportText);
                  setToast("Revisão copiada.");
                } catch {
                  setToast(
                    "Selecione o texto da revisão e copie pelo teclado.",
                  );
                }
              }}
            >
              Copiar revisão
            </Button>
            <a
              className="button secondary"
              download="revisao-bloomy.md"
              href={`data:text/markdown;charset=utf-8,${encodeURIComponent(exportText)}`}
            >
              Salvar arquivo
            </a>
            <Button variant="ghost" onClick={() => setExportText("")}>
              Fechar exportação
            </Button>
          </div>
        </dialog>
        {toast && (
          <div role="status" className="toast" onClick={() => setToast("")}>
            {toast}{" "}
            <button aria-label="Fechar aviso" onClick={() => setToast("")}>
              ×
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
