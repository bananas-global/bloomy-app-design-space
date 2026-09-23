import { useState, useRef, useEffect } from "react";
import {
  Home,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ArrowRight,
  MapPin,
} from "lucide-react";
import { patients, selectSchedules, type Schedule } from "../data/fixtures";
import {
  Avatar,
  Button,
  ScheduleCard,
  Status,
  Location,
} from "../components/ui";
export function FamilyApp({
  page,
  onPage,
  patient,
  onPatient,
  day,
  onDay,
  inspect = false,
  onInspect,
}: {
  page: string;
  onPage: (p: string) => void;
  patient: string;
  onPatient: (p: string) => void;
  day: number;
  onDay: (d: number) => void;
  inspect?: boolean;
  onInspect: (s: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [detail, setDetail] = useState<Schedule | null>(null);
  const [map, setMap] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (detail) dialog.current?.showModal();
    else dialog.current?.close();
  }, [detail]);
  const items = selectSchedules(
    patient,
    page === "agenda" ? day : undefined,
    query,
  )
    .filter((s) => page === "agenda" || s.day >= 23)
    .slice(0, page === "home" ? 2 : 99);
  return (
    <section
      className={`phone ${inspect ? "inspect" : ""}`}
      aria-label="Protótipo do app para responsáveis"
      onClickCapture={(e) => {
        if (!inspect) return;
        const el = (e.target as HTMLElement).closest("[data-component]");
        if (el) {
          e.preventDefault();
          e.stopPropagation();
          onInspect(el.getAttribute("data-component")!);
        }
      }}
    >
      <div className="phone-status">
        <span>9:41</span>
        <span>●●● ▰</span>
      </div>
      <header className="family-header">
        <img src="/logo.svg" alt="Bloomy" />
        <span className="guardian">AO</span>
      </header>
      <div className="phone-scroll">
        <div className="greeting">
          <p>
            Olá, Ana <span>☀</span>
          </p>
          <h2>
            {page === "home" ? "Vamos acompanhar cada conquista?" : "Agenda"}
          </h2>
          <p className="muted">
            {page === "home"
              ? "Um olhar próximo para o dia a dia."
              : "Os próximos passos, juntos."}
          </p>
        </div>
        <div className="patient-selector">
          <label htmlFor="patient">Acompanhando</label>
          <select
            id="patient"
            value={patient}
            onChange={(e) => onPatient(e.target.value)}
          >
            <option value="all">Todos os pacientes</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        {page === "home" ? (
          <>
            <div className="welcome-note">
              <span className="bloom-flower">✳</span>
              <div>
                <strong>
                  Pequenos passos.
                  <br />
                  Grandes descobertas.
                </strong>
                <p>Estar presente faz parte do caminho.</p>
              </div>
            </div>
            <div className="section-title">
              <h3>Próximos atendimentos</h3>
              <Button variant="ghost" onClick={() => onPage("agenda")}>
                Ver tudo <ArrowRight size={14} />
              </Button>
            </div>
            <p className="date-label">A partir de 23 de setembro</p>
          </>
        ) : (
          <>
            <div className="search">
              <Search size={17} />
              <input
                aria-label="Buscar por paciente ou sala"
                placeholder="Buscar por paciente, sala..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <Button
                  variant="ghost"
                  aria-label="Limpar busca"
                  onClick={() => setQuery("")}
                >
                  <X size={14} />
                </Button>
              )}
            </div>
            <div className="month">
              <strong>Setembro 2026</strong>
              <span>Semana de 21 a 27</span>
            </div>
            <div className="week">
              {["S", "T", "Q", "Q", "S", "S", "D"].map((label, i) => (
                <button
                  key={i}
                  aria-label={`${21 + i} de setembro`}
                  aria-pressed={day === 21 + i}
                  className={day === 21 + i ? "selected" : ""}
                  onClick={() => onDay(21 + i)}
                >
                  <span>{label}</span>
                  <strong>{21 + i}</strong>
                  <i
                    className={[22, 23, 24].includes(21 + i) ? "has-event" : ""}
                  />
                </button>
              ))}
            </div>
            <div className="section-title">
              <h3>{day} de setembro</h3>
              <span className="count">{items.length} atendimentos</span>
            </div>
          </>
        )}
        <div className="cards">
          {items.map((s) => (
            <ScheduleCard
              key={s.id}
              schedule={s}
              onOpen={(s) => {
                setMap(false);
                setDetail(s);
              }}
            />
          ))}
        </div>
        {!items.length && (
          <div className="empty">
            <CalendarDays size={28} />
            <h3>Nenhum atendimento por aqui</h3>
            <p>Escolha outro dia ou ajuste a busca.</p>
          </div>
        )}
        {page === "home" && (
          <Button
            variant="secondary"
            className="full"
            onClick={() => {
              onDay(22);
              onPage("agenda");
            }}
          >
            Consultar atendimento anterior <ChevronRight size={16} />
          </Button>
        )}
        <p className="synthetic">Ambiente de criação · dados fictícios</p>
      </div>
      <nav className="bottom-nav" aria-label="Navegação do protótipo">
        <button
          className={page === "home" ? "active" : ""}
          onClick={() => onPage("home")}
        >
          <Home size={21} />
          Início
        </button>
        <button
          className={page === "agenda" ? "active" : ""}
          onClick={() => onPage("agenda")}
        >
          <CalendarDays size={21} />
          Agenda
        </button>
        <div>
          <Avatar patientId={patient === "all" ? "p1" : patient} small />
          <span>
            {patient === "all"
              ? "Todos"
              : patients.find((p) => p.id === patient)?.name.split(" ")[0]}
          </span>
        </div>
      </nav>
      <dialog
        ref={dialog}
        onCancel={() => setDetail(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDetail(null);
        }}
      >
        {detail && (
          <>
            <div className="dialog-heading">
              <span>
                {detail.status === "Finalizado"
                  ? "Devolutiva"
                  : "Detalhes do atendimento"}
              </span>
              <Button
                variant="ghost"
                aria-label="Fechar detalhes"
                onClick={() => setDetail(null)}
              >
                <X size={20} />
              </Button>
            </div>
            <div className="detail-body">
              <Avatar patientId={detail.patientId} />
              <h2>{patients.find((p) => p.id === detail.patientId)?.name}</h2>
              <Status status={detail.status} />
              <h3>{detail.service}</h3>
              <p>
                {detail.professional} · {detail.specialty}
              </p>
              <div className="detail-date">
                <CalendarDays size={18} />
                {detail.day}/09/2026{" "}
                <span>
                  {detail.start} — {detail.end}
                </span>
              </div>
              {detail.feedback ? (
                <div className="feedback">
                  <h4>Sobre este atendimento</h4>
                  <p>{detail.feedback}</p>
                </div>
              ) : (
                <>
                  <Location onMap={() => setMap(true)} />
                  {map && (
                    <p role="status" className="map-note">
                      <MapPin size={18} />
                      Mapa simulado. Em produção, esta ação abre o aplicativo de
                      mapas com o endereço cadastrado.
                    </p>
                  )}
                </>
              )}
              <Button
                className="full"
                variant="secondary"
                onClick={() => setDetail(null)}
              >
                Voltar à agenda
              </Button>
            </div>
          </>
        )}
      </dialog>
    </section>
  );
}
