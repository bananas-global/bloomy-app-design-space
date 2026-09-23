export const referenceDate = "2026-09-23";
export const patients = [
  { id: "p1", name: "Lia Oliveira", initials: "LO", color: "peach" },
  { id: "p2", name: "Theo Oliveira", initials: "TO", color: "mint" },
] as const;
export type Schedule = {
  id: string;
  patientId: string;
  day: number;
  start: string;
  end: string;
  service: string;
  professional: string;
  specialty: string;
  room: string;
  status: "Agendado" | "Finalizado";
  feedback?: string;
};
export const schedules: Schedule[] = [
  {
    id: "a1",
    patientId: "p1",
    day: 23,
    start: "09:00",
    end: "10:00",
    service: "Terapia ABA",
    professional: "Camila Martins",
    specialty: "Psicóloga",
    room: "Sala 03",
    status: "Agendado",
  },
  {
    id: "a2",
    patientId: "p2",
    day: 23,
    start: "10:30",
    end: "11:30",
    service: "Fonoaudiologia",
    professional: "Rafael Almeida",
    specialty: "Fonoaudiólogo",
    room: "Sala 05",
    status: "Agendado",
  },
  {
    id: "a3",
    patientId: "p1",
    day: 23,
    start: "14:00",
    end: "15:00",
    service: "Terapia ocupacional",
    professional: "Marina Costa",
    specialty: "Terapeuta ocupacional",
    room: "Sala 02",
    status: "Agendado",
  },
  {
    id: "a4",
    patientId: "p1",
    day: 22,
    start: "09:00",
    end: "10:00",
    service: "Terapia ABA",
    professional: "Camila Martins",
    specialty: "Psicóloga",
    room: "Sala 03",
    status: "Finalizado",
    feedback:
      "Nesta sessão fictícia, Lia participou de atividades de comunicação e alternância de turnos. Praticou pedidos com apoio verbal e participou de uma brincadeira compartilhada. Este texto é apenas uma amostra sintética de devolutiva, sem orientação clínica.",
  },
  {
    id: "a5",
    patientId: "p2",
    day: 24,
    start: "10:30",
    end: "11:30",
    service: "Fonoaudiologia",
    professional: "Rafael Almeida",
    specialty: "Fonoaudiólogo",
    room: "Sala 05",
    status: "Agendado",
  },
];
export const unit = {
  name: "Unidade Jardim · fictícia",
  address: "Rua Exemplo, 100 · endereço fictício",
};
export function selectSchedules(patientId: string, day?: number, query = "") {
  return schedules.filter(
    (s) =>
      (patientId === "all" || s.patientId === patientId) &&
      (day === undefined || s.day === day) &&
      `${patients.find((p) => p.id === s.patientId)?.name} ${s.room} ${s.service}`
        .toLocaleLowerCase("pt-BR")
        .includes(query.toLocaleLowerCase("pt-BR")),
  );
}
