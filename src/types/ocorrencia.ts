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

// ACRESCENTADO: define os dados de cada registro do histórico.
export interface HistoricoStatus {
  // ACRESCENTADO: null indica que este é o registro inicial.
  statusAnterior: StatusOcorrencia | null;

  // ACRESCENTADO: status que a ocorrência passou a ter.
  novoStatus: StatusOcorrencia;

  // ACRESCENTADO: data e hora da alteração no formato ISO.
  alteradoEm: string | Date;
}

export interface OcorrenciaType {
  id: string;
  descricao: string;
  tipo: TipoOcorrencia;
  fotoUrl?: string;
  latitude?: number;
  longitude?: number;
  perigosa: boolean;
  criadaEm: Date | string;
  imagem: string;
  endereco: string;

  // ACRESCENTADO: lista das mudanças de status da ocorrência.
  // O campo é opcional para manter compatibilidade com os dados existentes.
  historicoStatus: HistoricoStatus[];
}
