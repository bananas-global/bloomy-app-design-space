export const componentDefaults = {
  settingsGuardianPhoto: true,
  settingsPatientPhoto: true,
  settingsProfileCount: "2",
  settingsPlatform: "ios",
  settingsSection: "security",
  settingsItem: "password",
  avatarRole: "patient",
  chipRole: "status",
  schedulePatientPhoto: "inherit",
  supervisorInitials: true,
  scheduleTime: "14:00",
  roomName: "Sala 1",
  unitName: "Unidade Jardim",
  headerPhoto: false,
  feedState: "inherit",
  feedCount: "1",
  postAvatarPhoto: false,
  postText: "medium",
  postMedia: "image",
  scheduleState: "inherit",
  scheduleCount: "2",
  status: "scheduled",
  hasProfessional: true,
  hasSupervisor: false,
  professionalPhoto: false,
};
export type Fixture = typeof componentDefaults & {
  showFeed: boolean;
  showSchedules: boolean;
  legalGuardianName: string;
  patientName: string;
  title: string;
  description: string;
  showContent: boolean;
  label: string;
  isEnabled: boolean;
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
      legalGuardianName: "Teste",
      patientName: "Teste Maria",
      title: "Teste v1",
      description: "Teste vídeo de coelho.",
      showContent: true,
      label: "PRÓXIMO",
      isEnabled: true,
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
      legalGuardianName: "Teste",
      patientName: "Teste Maria",
      title: "Teste v1",
      description: "Teste vídeo de coelho.",
      showContent: false,
      label: "PRÓXIMO",
      isEnabled: true,
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
      legalGuardianName: "Responsável de demonstração",
      patientName: "Paciente de demonstração Maria",
      title: "Atividades de comunicação e cooperação",
      description:
        "Orientações sintéticas para explorar a leitura de descrições longas no aplicativo.",
      showContent: true,
      label: "CONTINUAR PARA A PRÓXIMA ETAPA",
      isEnabled: true,
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
      legalGuardianName: "Teste",
      patientName: "Teste Maria",
      title: "Teste v1",
      description: "Teste vídeo de coelho.",
      showContent: true,
      label: "PRÓXIMO",
      isEnabled: false,
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
  legalGuardianName: "Marina",
  patientName: "Lucas Santos",
});
add("feed-only", "Somente feed", {
  showFeed: true,
  legalGuardianName: "Marina",
  patientName: "Lucas Santos",
});
add("appointments-only", "Somente atendimentos", {
  showSchedules: true,
  legalGuardianName: "Marina",
  patientName: "Lucas Santos",
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
add("cancelled", "Cancelado", { status: "cancelled" });
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
  settings: ["default"],
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
  CTileSettings: ["default", "long"],
  CAvatarUpdater: ["default", "photo"],
  CAppBarRow: ["default", "long"],
  CButtonBack: ["default", "long"],
  CText: ["default", "long"],
  CHeader: ["default", "long"],
  CCardList: ["default", "long"],
  CScaffold: ["default", "long"],
  CAvatar: ["default", "photo"],
  CChip: ["default", "cancelled"],
  CDivider: ["default", "supervised"],
  CButton: ["default", "disabled", "long"],
};
export const variationsFor = (target: string) =>
  variationIds[target] || ["default"];
// Real widget property names. Preview-only selectors never belong to app DTOs.
export const fixtureDataFields = ["legalGuardianName", "patientName", "title", "description", "label", "isEnabled", "status", "roomName", "unitName", "contentType", "hasProfessional", "hasSupervisor"] as const;
const legacyFixtureFields: Record<string, string> = {guardian: "legalGuardianName", patient: "patientName", contentTitle: "title", contentDescription: "description", buttonLabel: "label", buttonEnabled: "isEnabled", scheduleStatus: "status", scheduleRoom: "roomName", scheduleUnit: "unitName"};
export function serializeFixture(fixture: Fixture) {
  const data: Record<string, string | boolean> = {};
  const preview: Record<string, string | boolean> = {};
  for (const [key, value] of Object.entries(fixture)) {
    (fixtureDataFields.includes(key as typeof fixtureDataFields[number]) ? data : preview)[key] = value;
  }
  return { data, preview };
}
export function parseFixture(raw: string): Fixture {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    throw Error("JSON inválido. Confira aspas, vírgulas e chaves.");
  }
  if (!value || Array.isArray(value) || typeof value !== "object")
    throw Error("Use um objeto JSON.");
  if ("data" in value || "preview" in value) {
    if (Object.keys(value).some(k => !["data", "preview"].includes(k))) throw Error("O JSON contém campos desconhecidos.");
    for (const group of ["data", "preview"]) {
      if (!value[group] || typeof value[group] !== "object" || Array.isArray(value[group])) throw Error(`Grupo ${group}: esperado objeto.`);
      for (const key of Object.keys(value[group])) {
        const isData = fixtureDataFields.includes(key as typeof fixtureDataFields[number]);
        if ((group === "data") !== isData) throw Error(`Campo ${key} pertence ao grupo ${isData ? "data" : "preview"}.`);
      }
    }
    value = { ...value.preview, ...value.data };
  }
  for (const [oldName, realName] of Object.entries(legacyFixtureFields)) {
    if (oldName in value) {
      if (!(realName in value)) value[realName] = value[oldName];
      delete value[oldName];
    }
  }
  if (value.roomName === "none") value.roomName = "";
  value = { ...extras, ...value };
  for (const [key, base] of Object.entries(fixtures.default.data)) {
    if (typeof value[key] !== typeof base)
      throw Error(
        `Campo ${key}: esperado ${typeof base === "string" ? "texto" : "booleano"}.`,
      );
    if (
      typeof value[key] === "string" &&
      (value[key].length > 300 || (!value[key].trim() && !["searchText", "roomName"].includes(key)))
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
    status: ["scheduled", "ongoing", "finished", "cancelled"],
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
  max: { label: "iPhone Max · 440 × 956", width: 440, height: 956 },
  android: { label: "Android · 412 × 915", width: 412, height: 915 },
  tablet: { label: "Tablet · 768 × 1024", width: 768, height: 1024 },
  fluid: { label: "Área livre", width: 0, height: 0 },
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
type ControlGroup = { previewData?: Partial<Fixture>; nested?: boolean; component: string; title: string; note?: string; controls: Control[] };
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
  component: "CAppBarUser2",
  title: "Cabeçalho · CAppBarUser2",
  controls: [
    { field: "headerPhoto", label: "Avatar do responsável", options: yesNo },
    {
      field: "legalGuardianName",
      label: "Nome do responsável",
      options: [
        ["Mariana", "Mariana"],
        ["Mariana de Albuquerque Santos", "Mariana de Albuquerque Santos"],
      ],
    },
  ],
};
const feedControls: ControlGroup = {
  component: "FeedSection",
  title: "Feed · seção",
  controls: [
    { field: "feedState", label: "Estado do feed", options: states },
    { field: "feedCount", label: "Quantidade de posts", options: counts },
  ],
};
const postControls: ControlGroup = {
  component: "CCardFeed",
  title: "Post · CCardFeed",
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
  component: "AppointmentsSection",
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
  component: "CTileScheduleParent",
  title: "Atendimento · CTileScheduleParent",
  controls: [
    {
      field: "status",
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
const group = (component: string, title: string, controls: Control[]): ControlGroup => ({ component, title, controls });
const stateControl: Control = { field: "state", label: "Estado da tela", options: [["ready", "Pronto"], ["loading", "Carregando"], ["error", "Erro ao carregar"]] };
const searchControl: Control = { field: "searchText", label: "Busca", options: [["", "Busca vazia"], ["Teste", "Teste"], ["Sala 1", "Sala 1"], ["Sem resultado", "Sem resultado"]] };
const calendarControls = group("CCalendarWeekly", "Calendário · CCalendarWeekly", [{ field: "calendarMode", label: "Formato do calendário", options: [["month", "Mês"], ["week", "Semana"]] }]);
const searchControls = group("CTextField", "Busca · CTextField", [searchControl]);
const contentControls = group("CTileParentContent", "Conteúdo · CTileParentContent", [
  { field: "contentType", label: "Tipo de conteúdo", options: [["video", "Vídeo"], ["document", "Documento"]] },
  { field: "title", label: "Título do conteúdo", options: [["Teste v1", "Teste v1"], ["Atividades de comunicação e cooperação", "Atividades de comunicação e cooperação"]] },
  { field: "description", label: "Descrição do conteúdo", options: [["Teste vídeo de coelho.", "Descrição curta"], ["Orientações para explorar a comunicação, a cooperação e a participação nas atividades do dia a dia com a família.", "Descrição longa"]] },
]);
const platformControl: Control = {field: "settingsPlatform", label: "Plataforma das permissões", options: [["ios", "iOS · com instruções"], ["android", "Android · sem instruções"]]};
const profileControls = group("CAvatarUpdater", "Perfis · CAvatarUpdater", [
 {field: "settingsGuardianPhoto", label: "Foto do responsável", options: [["true", "Responsável com foto"], ["false", "Responsável sem foto"]]},
 {field: "legalGuardianName", label: "Nome do responsável", options: [["Mariana", "Mariana"], ["Mariana de Albuquerque Santos", "Mariana de Albuquerque Santos"]]},
 {field: "settingsPatientPhoto", label: "Foto do paciente", options: [["true", "Paciente com foto"], ["false", "Paciente sem foto"]]},
 {field: "patientName", label: "Nome do paciente", options: [["Lucas Santos", "Lucas Santos"], ["Lucas de Albuquerque Santos", "Lucas de Albuquerque Santos"]]},
 {field: "settingsProfileCount", label: "Quantidade de perfis", options: [["1", "Somente responsável"], ["2", "Responsável e 1 paciente"], ["4", "Responsável e 3 pacientes"]]},
]);
const sectionControl: Control = {field: "settingsSection", label: "Seção de configurações", options: [["security", "Segurança"], ["permissions", "Permissões"], ["information", "Informações"]]};
const itemControl: Control = {field: "settingsItem", label: "Item de configuração", options: [["password", "Redefinir senha"], ["notifications", "Notificações"], ["camera", "Câmera"], ["gallery", "Galeria"], ["terms", "Termos de uso"], ["consent", "Termo de Ciência"], ["about", "Sobre"]]};
const permissionControls = group("CTileSettings", "Permissões · CTileSettings", [platformControl]);
export function componentGroupsFor(target: string): ControlGroup[] {
  switch (target) {
    case "home": return [headerControls, { ...feedControls, controls: feedControls.controls.filter(control => control.field !== "feedCount") }, postControls, scheduleControls, appointmentControls];
    case "feed": case "FeedSection": return [feedControls, postControls];
    case "agenda": return [headerControls, calendarControls, searchControls, scheduleControls, appointmentControls];
    case "contents": return [headerControls, group("", "Lista de conteúdos", [stateControl, { field: "showContent", label: "Conteúdos disponíveis", options: [["true", "Com conteúdo"], ["false", "Sem conteúdos"]] }]), searchControls, contentControls];
    case "metrics": return [headerControls, group("", "Evolutivo", [stateControl])];
    case "settings": return [
 group("CAppBarRow", "Cabeçalho · CAppBarRow", []),
 profileControls,
 {component: "CAvatar", title: "Responsável · CAvatar", nested: true, previewData: {avatarRole: "guardian"}, controls: []},
 {component: "CAvatar", title: "Paciente · CAvatar", nested: true, previewData: {avatarRole: "patient"}, controls: []},
 group("CHeader", "Títulos das seções · CHeader", []),
 group("CCardList", "Cartões das seções · CCardList", []),
 {...permissionControls, previewData: {settingsItem: "notifications"}},
 group("CBottomBarUser", "Navegação · CBottomBarUser", []),
 group("CScaffold", "Estrutura da tela · CScaffold", []),
 ];
    case "login": return [group("", "Acesso", [{ field: "loginStep", label: "Etapa de acesso", options: [["cpf", "CPF"], ["password", "Senha"]] }])];
    case "notifications": return [group("", "Notificações", [stateControl])];
    case "CAppBarUser2": return [headerControls];
    case "CCardFeed": return [postControls];
    case "AppointmentsSection": return [scheduleControls, appointmentControls];
    case "CTileScheduleParent": return [
      { ...appointmentControls, controls: appointmentControls.controls.filter(c => ["hasProfessional", "hasSupervisor"].includes(c.field)) },
      { component: "CAvatar", previewData: { avatarRole: "patient" }, nested: true, title: "Paciente · CAvatar", controls: [{field: "schedulePatientPhoto", label: "Avatar do paciente", options: [["inherit", "Foto conforme os dados atuais"], ["true", "Com foto"], ["false", "Sem foto · iniciais"]]}] },
      { component: "CChip", previewData: { chipRole: "status" }, nested: true, title: "Status · CChip", controls: [appointmentControls.controls[0]] },
      { component: "CDivider", previewData: {  }, nested: true, title: "Separação · CDivider", controls: [], note: "Aparece quando há profissional. Usa o estilo definido pelo card." },
      { component: "CAvatar", previewData: { avatarRole: "professional" }, nested: true, title: "Profissional · CAvatar", controls: [appointmentControls.controls[2]] },
      { component: "CAvatar", previewData: { avatarRole: "supervisor" }, nested: true, title: "Supervisor · CAvatar", controls: [{field: "supervisorInitials", label: "Avatar do supervisor", options: [["true", "Iniciais"], ["false", "Ícone padrão"]]}] },
      { component: "CChip", previewData: { chipRole: "time" }, nested: true, title: "Horário · CChip", controls: [{field: "scheduleTime", label: "Horário", options: [["14:00", "14:00"], ["09:30", "09:30"], ["none", "Sem horário"]]}] },
      { component: "CChip", previewData: { chipRole: "room" }, nested: true, title: "Sala · CChip", controls: [{field: "roomName", label: "Sala", options: [["Sala 1", "Sala 1"], ["Sala de atendimento infantil", "Sala de atendimento infantil"], ["", "Sem sala"]]}] },
      { component: "CChip", previewData: { chipRole: "unit" }, nested: true, title: "Unidade · CChip", controls: [{field: "unitName", label: "Unidade", options: [["Unidade Jardim", "Unidade Jardim"], ["Unidade Vila Mariana", "Unidade Vila Mariana"]]}] },
    ];
    case "CCalendarWeekly": return [calendarControls, searchControls];
    case "CTextField": return [group("CTextField", "Campo · CTextField", [searchControl, { field: "fieldError", label: "Validação do campo", options: [["false", "Sem erro"], ["true", "Com erro"]] }])];
    case "CBottomBarUser": return [group("CBottomBarUser", "Navegação · CBottomBarUser", [{ field: "navigation", label: "Item selecionado", options: [["home", "Início"], ["contents", "Conteúdos"], ["metrics", "Evolutivo"], ["agenda", "Agenda"]] }])];
    case "CContainerListInformation": return [group("CContainerListInformation", "Estado da lista", [{ ...stateControl, options: [["ready", "Vazio"], ["loading", "Carregando"], ["error", "Erro"]] }])];
    case "CTileParentContent": return [{ ...contentControls, controls: [{ field: "showContent", label: "Conteúdo disponível", options: [["true", "Com conteúdo"], ["false", "Sem conteúdo"]] }, ...contentControls.controls] }];
    case "CTileSettings": return [group("", "Item · CTileSettings", [itemControl, platformControl])];
    case "CAvatarUpdater": return [profileControls, {component: "CAvatar", title: "Avatar do responsável", previewData: {avatarRole: "guardian"}, controls: []}, {component: "CButton", title: "Botão de edição", controls: [], note: "O seletor de perfis usa o botão da biblioteca para editar a foto."}];
    case "CAppBarRow": return [group("CText", "Título · CText", []), group("CButtonBack", "Voltar · CButtonBack", [])];
    case "CButtonBack": return [group("", "Botão de voltar", [])];
    case "CText": return [group("", "Título de Configurações", [])];
    case "CHeader": return [group("", "Título da seção", [sectionControl])];
    case "CCardList": return [group("", "Cartão de lista", [sectionControl, platformControl]), group("CTileSettings", "Itens · CTileSettings", [])];
    case "CScaffold": return [group("CAppBarRow", "Cabeçalho", []), group("CBottomBarUser", "Navegação inferior", [])];
    case "CAvatar": return [group("", "Avatar · CAvatar", [{field: "avatarRole", label: "Pessoa do avatar", options: [["patient", "Paciente"], ["guardian", "Responsável"], ["professional", "Profissional"], ["supervisor", "Supervisor"]]}, {field: "settingsGuardianPhoto", label: "Foto do responsável", options: [["true", "Responsável com foto"], ["false", "Responsável sem foto"]]}, ...componentGroupsFor("CTileScheduleParent").filter(g => g.component === "CAvatar").flatMap(g => g.controls)])];
    case "CChip": return [group("", "Chip · CChip", [{field: "chipRole", label: "Tipo de chip", options: [["status", "Status"], ["time", "Horário"], ["room", "Sala"], ["unit", "Unidade"]]}, ...componentGroupsFor("CTileScheduleParent").filter(g => g.component === "CChip").flatMap(g => g.controls)])];
    case "CDivider": return [{component: "", title: "Divisória · CDivider", controls: [], note: "Estilo usado no card de atendimento. A largura acompanha o espaço disponível."}];
    case "CButton": return [group("CButton", "Botão · CButton", [{ field: "isEnabled", label: "Disponibilidade", options: [["true", "Habilitado"], ["false", "Desabilitado"]] }, { field: "label", label: "Texto do botão", options: [["PRÓXIMO", "PRÓXIMO"], ["CONTINUAR PARA A PRÓXIMA ETAPA", "CONTINUAR PARA A PRÓXIMA ETAPA"]] }])];
    default: return [];
  }
}

export const itemDetails: Record<string, string> = {
  home: "O feed e os próximos atendimentos têm estados independentes. É possível combinar carregamento, erro, vazio e dados preenchidos em cada seção.",
  agenda: "O calendário alterna entre mês e semana. Os atendimentos de demonstração estão em 23 de setembro de 2026. A busca filtra paciente, sala e unidade.",
  contents: "A lista mostra conteúdos educativos em vídeo ou documento. A busca considera o título e a descrição; cada cartão abre seus detalhes.",
  metrics: "Apresenta áreas e fases de evolução. A amostra atual tem valores zerados; as variações permitem conferir carregamento e erro.",
  settings: "Reúne o perfil do responsável e as preferências do aplicativo. As permissões são simuladas localmente e podem ser alteradas na prévia.",
  login: "O acesso tem uma etapa de CPF e outra de senha. Os campos são interativos, mas não autenticam em um serviço real.",
  feed: "Reúne os registros de atividades do paciente. O estado e a quantidade de posts são configuráveis; as opções do cartão se aplicam aos posts da amostra.",
  notifications: "Lista de avisos do responsável. A amostra atual é vazia; também permite avaliar carregamento e erro.",
  CAppBarUser2: "Cabeçalho com saudação, nome do responsável, avatar e acesso ao menu. Permite comparar nomes de comprimentos diferentes e avatar com ou sem foto.",
  FeedSection: "Seção que reúne o título, o acesso ao feed completo e seus posts. Pode estar vazia, carregando, com erro ou preenchida com um a três registros.",
  CCardFeed: "O avatar é do paciente. O card exige imagem ou vídeo e não oferece post sem mídia. As variações se aplicam a todos os posts da amostra.",
  AppointmentsSection: "Seção dos próximos atendimentos, com acesso à agenda. O estado da lista e a quantidade de cartões são independentes dos estados do feed.",
  CTileScheduleParent: "Cartão com paciente, especialidade, status, profissional, supervisor, horário e local. Permite comparar disponibilidade da equipe, fotos e status do atendimento.",
  CBottomBarUser: "Navegação principal do responsável. A amostra isolada permite escolher o item selecionado; nas telas, ele acompanha a navegação do app.",
  CCalendarWeekly: "Calendário com visualização mensal ou semanal e seleção de data. A amostra inclui a busca e feriados de demonstração em setembro de 2026.",
  CTextField: "Campo de busca com texto editável. A amostra isolada permite conferir o campo vazio, preenchido e com mensagem de erro.",
  CContainerListInformation: "Mensagem ilustrada de lista vazia. Carregamento e erro substituem essa mensagem pelos estados correspondentes da prévia.",
  CTileParentContent: "Cartão de conteúdo educativo com paciente, título, descrição, data e etiquetas. Diferencia vídeo e documento e permite avaliar textos mais longos.",
  CTileSettings: "Item de configuração com controle de permissão. As variações escolhem o tipo de item e a plataforma; os toggles são operados diretamente na amostra.",
  CAvatarUpdater: "Organiza os perfis do responsável e pacientes, com seleção e botão de edição. Usa CAvatar e CButton.",
  CAppBarRow: "Cabeçalho superior com título central e botão de voltar.",
  CButtonBack: "Botão de retorno usado no cabeçalho. A amostra simula a ação localmente.",
  CText: "Texto do título com o estilo de detalhes do app.",
  CHeader: "Título de seção para Segurança, Permissões e Informações.",
  CCardList: "Container que agrupa itens de configuração e preserva o estilo de lista.",
  CScaffold: "Estrutura que distribui cabeçalho, conteúdo rolável e navegação inferior.",
  CAvatar: "Avatar reutilizável. A amostra usa os dados e o estilo do card de atendimento, com paciente, profissional e supervisor.",
  CChip: "Rótulo compacto de status, horário, sala ou unidade. A amostra preserva o estilo usado no atendimento.",
  CDivider: "Linha que separa os dados do paciente da equipe no card de atendimento. Sua presença é controlada pelo card.",
  CButton: "Botão de ação com texto configurável. Permite comparar rótulos curtos e longos, habilitado ou desabilitado.",
};

export const componentPositioning: Record<string, string> = {
  CAppBarUser2: "No topo da tela, ocupando toda a largura abaixo da área segura superior. Fica fora da rolagem do conteúdo.",
  CBottomBarUser: "Fixa no rodapé, ocupando toda a largura e respeitando a área segura inferior. O conteúdo da tela rola acima dela.",
  FeedSection: "Na área de conteúdo, com título e posts empilhados. Acompanha a rolagem da tela; não tem posição fixa.",
  AppointmentsSection: "Na área de conteúdo, com título e atendimentos empilhados. Acompanha a rolagem da tela; não tem posição fixa.",
  CCardFeed: "Dentro da lista de posts, ocupando a largura disponível com margens laterais. A altura acompanha a mídia e o texto; rola com a lista.",
  CTileScheduleParent: "Dentro da lista de atendimentos, com margens laterais. A altura depende das informações exibidas; rola com a lista.",
  CCalendarWeekly: "Na Agenda, integra a área abaixo do cabeçalho, acima da lista de atendimentos. Na amostra isolada aparece no topo da área útil, junto da busca.",
  CTextField: "Ocupa a largura disponível no seu container. Nas buscas da Agenda e de Conteúdos, fica abaixo do cabeçalho; na amostra isolada recebe margem de 16 pixels.",
  CContainerListInformation: "Dentro da seção cujo conteúdo está vazio, centralizado horizontalmente. Não é uma sobreposição nem ocupa obrigatoriamente a tela inteira.",
  CTileParentContent: "Dentro da lista de conteúdos educativos, ocupando a largura disponível. A altura acompanha o título, a descrição e as etiquetas.",
  CTileSettings: "Dentro do cartão de configurações, como uma linha da lista. Acompanha a rolagem da tela.",
  CAvatarUpdater: "Dentro da área de conteúdo; na tela, o componente pai define sua posição.",
  CAppBarRow: "Fixo no topo da prévia.",
  CButtonBack: "Dentro da área de conteúdo; na tela, o componente pai define sua posição.",
  CText: "Dentro da área de conteúdo; na tela, o componente pai define sua posição.",
  CHeader: "Dentro da área de conteúdo; na tela, o componente pai define sua posição.",
  CCardList: "Dentro da área de conteúdo; na tela, o componente pai define sua posição.",
  CScaffold: "Ocupa o viewport e reserva espaço para cabeçalho e rodapé.",
  CAvatar: "Posicionado pelo componente que o contém. No atendimento, aparece ao lado do nome da pessoa.",
  CChip: "Ocupa a largura do conteúdo. No atendimento, fica junto ao paciente ou na linha de horário e local.",
  CDivider: "Ocupa a largura disponível dentro do container, entre as seções do card.",
  CButton: "No container da ação. O posicionamento é definido pela tela que o utiliza; a amostra isolada tem margem de 16 pixels.",
};

/** Returns the reason a visible variation cannot affect the current preview. */
export function controlDisabledReason(target: string, component: string, field: keyof Fixture, data: Fixture): string | undefined {
  if (["settings", "CAvatarUpdater"].includes(target) && data.settingsProfileCount === "1" && ["settingsPatientPhoto", "patientName"].includes(field)) return "Disponível quando há paciente.";
  if (target === "CTileSettings" && field === "settingsPlatform" && !["notifications", "camera", "gallery"].includes(data.settingsItem)) return "Disponível nos itens de permissão.";
  if (target === "CCardList" && field === "settingsPlatform" && data.settingsSection !== "permissions") return "Disponível na seção de permissões.";
  if (target === "CAvatar" && ({settingsGuardianPhoto: "guardian", schedulePatientPhoto: "patient", professionalPhoto: "professional", supervisorInitials: "supervisor"} as Record<string,string>)[field] && ({settingsGuardianPhoto: "guardian", schedulePatientPhoto: "patient", professionalPhoto: "professional", supervisorInitials: "supervisor"} as Record<string,string>)[field] !== data.avatarRole) return "Selecione a pessoa correspondente.";
  if (target === "CChip" && ({status: "status", scheduleTime: "time", roomName: "room", unitName: "unit"} as Record<string,string>)[field] && ({status: "status", scheduleTime: "time", roomName: "room", unitName: "unit"} as Record<string,string>)[field] !== data.chipRole) return "Selecione o tipo correspondente.";
  if (target === "CTileScheduleParent" && field === "professionalPhoto" && !data.hasProfessional)
    return "Disponível quando há profissional.";
  if (target === "CTileScheduleParent" && field === "supervisorInitials" && (!data.hasProfessional || !data.hasSupervisor))
    return "Disponível quando há profissional e supervisor.";
  const feedContext = ["home", "feed", "FeedSection"].includes(target);
  const scheduleContext = ["home", "agenda", "AppointmentsSection"].includes(target);
  if (feedContext && sectionState(data, "feed") !== "ready" &&
      (component === "CCardFeed" || field === "feedCount"))
    return "Disponível quando o feed está preenchido.";
  if (scheduleContext && sectionState(data, "schedule") !== "ready" &&
      (component === "CTileScheduleParent" || field === "scheduleCount"))
    return "Disponível quando os atendimentos estão preenchidos.";
  if (component === "CTileScheduleParent" && !data.hasProfessional &&
      (field === "professionalPhoto" || field === "hasSupervisor"))
    return "Disponível quando há profissional.";
  if (target === "contents" && data.state !== "ready" &&
      (component === "CTileParentContent" || field === "showContent"))
    return "Disponível quando a lista de conteúdos está pronta.";
  if (component === "CTileParentContent" && !data.showContent && field !== "showContent")
    return "Disponível quando há conteúdo.";
  return undefined;
}
