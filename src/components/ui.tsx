import type { ButtonHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight, Clock3, MapPin, ChevronRight } from "lucide-react";
import { patients, unit, type Schedule } from "../data/fixtures";
export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  children: ReactNode;
}) {
  return (
    <button
      data-component="Button"
      className={`button ${variant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
export function Avatar({
  patientId,
  small = false,
}: {
  patientId: string;
  small?: boolean;
}) {
  const p = patients.find((p) => p.id === patientId)!;
  return (
    <span
      data-component="Avatar"
      className={`avatar ${p.color} ${small ? "small" : ""}`}
    >
      {p.initials}
    </span>
  );
}
export function Status({ status }: { status: Schedule["status"] }) {
  return (
    <span
      data-component="Status"
      className={`status ${status === "Finalizado" ? "done" : ""}`}
    >
      <i />
      {status}
    </span>
  );
}
export function ScheduleCard({
  schedule: s,
  onOpen,
}: {
  schedule: Schedule;
  onOpen: (s: Schedule) => void;
}) {
  const p = patients.find((p) => p.id === s.patientId)!;
  return (
    <button
      data-component="ScheduleCard"
      className="schedule-card"
      onClick={() => onOpen(s)}
      aria-label={`${s.service}, ${p.name}, ${s.start}, ${s.status}`}
    >
      <div className="card-top">
        <span className="time">
          <Clock3 size={14} />
          {s.start} <span>— {s.end}</span>
        </span>
        <Status status={s.status} />
      </div>
      <p className="card-date">{s.day} de setembro</p>
      <div className="card-person">
        <Avatar patientId={s.patientId} />
        <div>
          <strong>{s.service}</strong>
          <p>{p.name}</p>
        </div>
        <ChevronRight size={18} />
      </div>
      <div className="card-bottom">
        <span>{s.professional}</span>
        <span>{s.room}</span>
      </div>
    </button>
  );
}
export function Location({ onMap }: { onMap: () => void }) {
  return (
    <div className="location">
      <MapPin size={20} />
      <div>
        <strong>{unit.name}</strong>
        <p>{unit.address}</p>
      </div>
      <Button variant="ghost" aria-label="Abrir mapa simulado" onClick={onMap}>
        <ArrowUpRight size={18} />
      </Button>
    </div>
  );
}
