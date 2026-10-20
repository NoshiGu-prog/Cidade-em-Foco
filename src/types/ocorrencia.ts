export type StatusOcorrencia =
  | "ENVIADA"
  | "EM_ANALISE"
  | "EM_ANDAMENTO"
  | "RESOLVIDA";

export const TIPO_OCORRENCIA_VALUES = [
  "BURACO",
  "ILUMINACAO",
  "ARBORIZACAO",
  "SANEAMENTO",
  "LIMPEZA",
  "ELETRICA",
  "TRANSITO",
  "OUTROS",
] as const;

export const TIPOS_OCORRENCIA = [
  { value: "BURACO", label: "Buraco na via" },
  { value: "ILUMINACAO", label: "Iluminação pública" },
  { value: "ARBORIZACAO", label: "Árvore e vegetação" },
  { value: "SANEAMENTO", label: "Água e saneamento" },
  { value: "LIMPEZA", label: "Lixo e limpeza" },
  { value: "ELETRICA", label: "Fiação e energia" },
  { value: "TRANSITO", label: "Trânsito e sinalização" },
  { value: "OUTROS", label: "Outros problemas" },
] as const;

export type TipoOcorrencia = (typeof TIPO_OCORRENCIA_VALUES)[number];

export interface AlteracaoStatusOcorrencia {
  statusAnterior: StatusOcorrencia;
  alteradoEm: Date | string;
  statusNovo: StatusOcorrencia;
}

export interface OcorrenciaType {
  id: string;
  descricao: string;
  tipo: TipoOcorrencia;
  fotoUrl?: string;
  latitude?: number;
  longitude?: number;
  perigosa: boolean;
  status: StatusOcorrencia;
  historicoStatus: AlteracaoStatusOcorrencia[];
  criadaEm: Date | string;
  imagem: string;
  endereco: string;
}
