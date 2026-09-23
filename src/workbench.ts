export type Fixture = {
  guardian: string;
  patient: string;
  contentTitle: string;
  contentDescription: string;
  showContent: boolean;
  buttonLabel: string;
  buttonEnabled: boolean;
};
export const fixtures: Record<string, { label: string; data: Fixture }> = {
  reference: {
    label: "Referência da gravação",
    data: {
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
export function parseFixture(raw: string): Fixture {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    throw Error("JSON inválido. Confira aspas, vírgulas e chaves.");
  }
  if (!value || Array.isArray(value) || typeof value !== "object")
    throw Error("Use um objeto JSON.");
  for (const [key, base] of Object.entries(fixtures.reference.data)) {
    if (typeof value[key] !== typeof base)
      throw Error(
        `Campo ${key}: esperado ${typeof base === "string" ? "texto" : "booleano"}.`,
      );
    if (
      typeof value[key] === "string" &&
      (value[key].length > 300 || !value[key].trim())
    )
      throw Error(`Campo ${key}: use entre 1 e 300 caracteres.`);
  }
  if (Object.keys(value).some((k) => !(k in fixtures.reference.data)))
    throw Error("O JSON contém campos desconhecidos.");
  return value as Fixture;
}
export function initialFixture(params: URLSearchParams): {
  id: string;
  data: Fixture;
  error: string;
} {
  const id = params.get("fixture") || "reference";
  if (params.has("data"))
    try {
      return {
        id: "custom",
        data: parseFixture(params.get("data")!),
        error: "",
      };
    } catch {
      return {
        id: "reference",
        data: fixtures.reference.data,
        error: "Fixture do link inválida. Referência restaurada.",
      };
    }
  return fixtures[id]
    ? { id, data: fixtures[id].data, error: "" }
    : {
        id: "reference",
        data: fixtures.reference.data,
        error: "Fixture desconhecida. Referência restaurada.",
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
