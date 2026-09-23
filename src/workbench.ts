export const componentDefaults = {
  headerPhoto: false,
  feedState: "inherit",
  feedCount: "1",
  postAvatarPhoto: false,
  postText: "medium",
  postMedia: "image",
  scheduleState: "inherit",
  scheduleCount: "2",
  scheduleStatus: "scheduled",
  hasProfessional: true,
  hasSupervisor: false,
  professionalPhoto: false,
};
export type Fixture = typeof componentDefaults & {
  showFeed: boolean;
  showSchedules: boolean;
  guardian: string;
  patient: string;
  contentTitle: string;
  contentDescription: string;
  showContent: boolean;
  buttonLabel: string;
  buttonEnabled: boolean;
  state: string;
  calendarMode: string;
  loginStep: string;
  permissions: string;
  searchText: string;
  fieldError: boolean;
  navigation: string;
  contentType: string;
};
export const fixtures: Record<string, { label: string; data: Fixture }> = {
  default: {
    label: "Padrão",
    data: {
      ...componentDefaults,
      showFeed: false,
      showSchedules: false,
      state: "ready",
      calendarMode: "month",
      loginStep: "cpf",
      permissions: "reference",
      searchText: "",
      fieldError: false,
      navigation: "home",
      contentType: "video",
      guardian: "Teste",
      patient: "Teste Maria",
      contentTitle: "Teste v1",
      contentDescription: "Teste vídeo de coelho.",
      showContent: true,
      buttonLabel: "PRÓXIMO",
      buttonEnabled: true,
    },
  },
  empty: {
    label: "Sem conteúdos",
    data: {
      ...componentDefaults,
      showFeed: false,
      showSchedules: false,
      state: "ready",
      calendarMode: "month",
      loginStep: "cpf",
      permissions: "reference",
      searchText: "",
      fieldError: false,
      navigation: "home",
      contentType: "video",
      guardian: "Teste",
      patient: "Teste Maria",
      contentTitle: "Teste v1",
      contentDescription: "Teste vídeo de coelho.",
      showContent: false,
      buttonLabel: "PRÓXIMO",
      buttonEnabled: true,
    },
  },
  long: {
    label: "Textos longos",
    data: {
      ...componentDefaults,
      showFeed: false,
      showSchedules: false,
      state: "ready",
      calendarMode: "month",
      loginStep: "cpf",
      permissions: "reference",
      searchText: "",
      fieldError: false,
      navigation: "home",
      contentType: "video",
      guardian: "Responsável de demonstração",
      patient: "Paciente de demonstração Maria",
      contentTitle: "Atividades de comunicação e cooperação",
      contentDescription:
        "Orientações sintéticas para explorar a leitura de descrições longas no aplicativo.",
      showContent: true,
      buttonLabel: "CONTINUAR PARA A PRÓXIMA ETAPA",
      buttonEnabled: true,
    },
  },
  disabled: {
    label: "Botão desabilitado",
    data: {
      ...componentDefaults,
      showFeed: false,
      showSchedules: false,
      state: "ready",
      calendarMode: "month",
      loginStep: "cpf",
      permissions: "reference",
      searchText: "",
      fieldError: false,
      navigation: "home",
      contentType: "video",
      guardian: "Teste",
      patient: "Teste Maria",
      contentTitle: "Teste v1",
      contentDescription: "Teste vídeo de coelho.",
      showContent: true,
      buttonLabel: "PRÓXIMO",
      buttonEnabled: false,
    },
  },
};
const extras = {
  ...componentDefaults,
  showFeed: false,
  showSchedules: false,
  state: "ready",
  calendarMode: "month",
  loginStep: "cpf",
  permissions: "reference",
  searchText: "",
  fieldError: false,
  navigation: "home",
  contentType: "video",
};
const add = (id: string, label: string, patch: Partial<Fixture>) => {
  fixtures[id] = { label, data: { ...fixtures.default.data, ...patch } };
};
add("populated", "Feed e atendimentos preenchidos", {
  showFeed: true,
  showSchedules: true,
  guardian: "Marina",
  patient: "Lucas Santos",
});
add("feed-only", "Somente feed", {
  showFeed: true,
  guardian: "Marina",
  patient: "Lucas Santos",
});
add("appointments-only", "Somente atendimentos", {
  showSchedules: true,
  guardian: "Marina",
  patient: "Lucas Santos",
});
add("loading", "Carregando", { state: "loading" });
add("error", "Erro ao carregar", { state: "error" });
add("week", "Calendário semanal", { calendarMode: "week" });
add("password", "Etapa de senha", { loginStep: "password" });
add("permissions-on", "Todas permitidas", { permissions: "on" });
add("permissions-off", "Todas desativadas", { permissions: "off" });
add("search-filled", "Busca preenchida", { searchText: "Teste" });
add("field-error", "Campo com erro", { fieldError: true });
add("nav-agenda", "Agenda selecionada", { navigation: "agenda" });
add("document", "Conteúdo em documento", { contentType: "document" });
add("mixed", "Feed preenchido e atendimentos carregando", {
  feedState: "ready",
  feedCount: "3",
  scheduleState: "loading",
});
add("photo", "Avatar com foto", {
  headerPhoto: true,
  postAvatarPhoto: true,
  professionalPhoto: true,
});
add("post-long", "Descrição longa", { postText: "long" });
add("post-video", "Mídia em vídeo", { postMedia: "video" });
add("supervised", "Com supervisor", { hasSupervisor: true });
add("cancelled", "Cancelado", { scheduleStatus: "cancelled" });
export const variationIds: Record<string, string[]> = {
  home: [
    "default",
    "populated",
    "feed-only",
    "appointments-only",
    "long",
    "loading",
    "error",
  ],
  agenda: ["default", "populated", "week", "loading", "error"],
  contents: ["default", "empty", "long", "document", "loading", "error"],
  metrics: ["default", "long", "loading", "error"],
  settings: ["default", "permissions-on", "permissions-off"],
  login: ["default", "password"],
  feed: ["default", "populated", "loading", "error"],
  notifications: ["default", "loading", "error"],
  CAppBarUser2: ["default", "long", "photo"],
  CCardFeed: ["default", "photo", "post-long", "post-video"],
  CTileScheduleParent: ["default", "photo", "supervised", "cancelled"],
  FeedSection: ["default", "populated", "loading", "error", "mixed"],
  AppointmentsSection: ["default", "populated", "loading", "error", "mixed"],
  CBottomBarUser: ["default", "nav-agenda"],
  CCalendarWeekly: ["default", "week"],
  CTextField: ["default", "search-filled", "field-error"],
  CContainerListInformation: ["default", "loading", "error"],
  CTileParentContent: ["default", "long", "document"],
  CTileSettings: ["default", "permissions-off"],
  CButton: ["default", "disabled", "long"],
};
export const variationsFor = (target: string) =>
  variationIds[target] || ["default"];
export function parseFixture(raw: string): Fixture {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    throw Error("JSON inválido. Confira aspas, vírgulas e chaves.");
  }
  if (!value || Array.isArray(value) || typeof value !== "object")
    throw Error("Use um objeto JSON.");
  value = { ...extras, ...value };
  for (const [key, base] of Object.entries(fixtures.default.data)) {
    if (typeof value[key] !== typeof base)
      throw Error(
        `Campo ${key}: esperado ${typeof base === "string" ? "texto" : "booleano"}.`,
      );
    if (
      typeof value[key] === "string" &&
      (value[key].length > 300 || (!value[key].trim() && key !== "searchText"))
    )
      throw Error(`Campo ${key}: use entre 1 e 300 caracteres.`);
  }
  if (Object.keys(value).some((k) => !(k in fixtures.default.data)))
    throw Error("O JSON contém campos desconhecidos.");
  const enums: Record<string, string[]> = {
    feedState: ["inherit", "empty", "loading", "error", "ready"],
    scheduleState: ["inherit", "empty", "loading", "error", "ready"],
    feedCount: ["1", "2", "3"],
    scheduleCount: ["1", "2", "3"],
    postText: ["short", "medium", "long"],
    postMedia: ["image", "video"],
    scheduleStatus: ["scheduled", "ongoing", "finished", "cancelled"],
    state: ["ready", "loading", "error"],
    calendarMode: ["month", "week"],
    loginStep: ["cpf", "password"],
    permissions: ["reference", "on", "off"],
    navigation: ["home", "contents", "metrics", "agenda"],
    contentType: ["video", "document"],
  };
  for (const [key, values] of Object.entries(enums))
    if (!values.includes(value[key])) throw Error(`Valor inválido em ${key}.`);
  return value as Fixture;
}
export function initialFixture(params: URLSearchParams): {
  id: string;
  data: Fixture;
  error: string;
} {
  const requested = params.get("fixture") || "default";
  const id = requested === "reference" ? "default" : requested;
  if (params.has("data"))
    try {
      return {
        id: "custom",
        data: parseFixture(params.get("data")!),
        error: "",
      };
    } catch {
      return {
        id: "default",
        data: fixtures.default.data,
        error: "Fixture do link inválida. Padrões restaurados.",
      };
    }
  return fixtures[id]
    ? { id, data: fixtures[id].data, error: "" }
    : {
        id: "default",
        data: fixtures.default.data,
        error: "Fixture desconhecida. Padrões restaurados.",
      };
}
export const viewports: Record<
  string,
  { label: string; width: number; height: number }
> = {
  mobile: { label: "iPhone · 402 × 874", width: 402, height: 874 },
  compact: { label: "Celular · 375 × 812", width: 375, height: 812 },
  tablet: { label: "Tablet · 768 × 1024", width: 768, height: 1024 },
  desktop: { label: "Desktop · 1440 × 900", width: 1440, height: 900 },
};
export function dimension(
  raw: string | null,
  fallback: number,
  min: number,
  max: number,
) {
  const n = Number(raw);
  return raw && Number.isFinite(n)
    ? Math.max(min, Math.min(max, Math.round(n)))
    : fallback;
}
export function normalizeSearch(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function sectionState(data: Fixture, section: "feed" | "schedule") {
  const explicit = section === "feed" ? data.feedState : data.scheduleState;
  if (explicit !== "inherit") return explicit;
  if (data.state !== "ready") return data.state;
  return (section === "feed" ? data.showFeed : data.showSchedules)
    ? "ready"
    : "empty";
}
export function patchComponent(
  data: Fixture,
  patch: Partial<Fixture>,
): Fixture {
  return {
    ...data,
    feedState: sectionState(data, "feed"),
    scheduleState: sectionState(data, "schedule"),
    ...patch,
  };
}
type Control = {
  field: keyof Fixture;
  label: string;
  options: [string, string][];
};
type ControlGroup = { title: string; note?: string; controls: Control[] };
const yesNo: [string, string][] = [
  ["false", "Sem foto"],
  ["true", "Com foto"],
];
const states: [string, string][] = [
  ["empty", "Vazio"],
  ["loading", "Carregando"],
  ["error", "Erro"],
  ["ready", "Preenchido"],
];
const counts: [string, string][] = [
  ["1", "1"],
  ["2", "2"],
  ["3", "3"],
];
const headerControls: ControlGroup = {
  title: "Cabeçalho · CAppBarUser2",
  controls: [
    { field: "headerPhoto", label: "Avatar do responsável", options: yesNo },
    {
      field: "guardian",
      label: "Nome do responsável",
      options: [
        ["Teste", "Normal"],
        ["Responsável de demonstração", "Longo"],
      ],
    },
  ],
};
const feedControls: ControlGroup = {
  title: "Feed · seção",
  controls: [
    { field: "feedState", label: "Estado do feed", options: states },
    { field: "feedCount", label: "Quantidade de posts", options: counts },
  ],
};
const postControls: ControlGroup = {
  title: "Post · CCardFeed",
  note: "O avatar é do paciente. O card original exige imagem ou vídeo; não oferece post sem mídia. As variações abaixo se aplicam a todos os posts da amostra.",
  controls: [
    {
      field: "postMedia",
      label: "Mídia do post",
      options: [
        ["image", "Imagem"],
        ["video", "Vídeo (capa)"],
      ],
    },
    { field: "postAvatarPhoto", label: "Avatar do paciente", options: yesNo },
    {
      field: "postText",
      label: "Descrição do post",
      options: [
        ["short", "Curta"],
        ["medium", "Média"],
        ["long", "Longa"],
      ],
    },
  ],
};
const scheduleControls: ControlGroup = {
  title: "Próximos atendimentos · seção",
  controls: [
    {
      field: "scheduleState",
      label: "Estado dos atendimentos",
      options: states,
    },
    {
      field: "scheduleCount",
      label: "Quantidade de atendimentos",
      options: counts,
    },
  ],
};
const appointmentControls: ControlGroup = {
  title: "Atendimento · CTileScheduleParent",
  controls: [
    {
      field: "scheduleStatus",
      label: "Status do atendimento",
      options: [
        ["scheduled", "Agendado"],
        ["ongoing", "Em andamento"],
        ["finished", "Finalizado"],
        ["cancelled", "Cancelado"],
      ],
    },
    {
      field: "hasProfessional",
      label: "Profissional",
      options: [
        ["false", "Sem profissional"],
        ["true", "Com profissional"],
      ],
    },
    {
      field: "professionalPhoto",
      label: "Avatar do profissional",
      options: yesNo,
    },
    {
      field: "hasSupervisor",
      label: "Supervisor",
      options: [
        ["false", "Sem supervisor"],
        ["true", "Com supervisor"],
      ],
    },
  ],
};
export function componentGroupsFor(target: string): ControlGroup[] {
  switch (target) {
    case "home":
      return [
        headerControls,
        feedControls,
        postControls,
        scheduleControls,
        appointmentControls,
      ];
    case "feed":
    case "FeedSection":
      return [feedControls, postControls];
    case "agenda":
      return [headerControls, scheduleControls, appointmentControls];
    case "CAppBarUser2":
      return [headerControls];
    case "CCardFeed":
      return [postControls];
    case "AppointmentsSection":
      return [scheduleControls, appointmentControls];
    case "CTileScheduleParent":
      return [appointmentControls];
    default:
      return [];
  }
}
