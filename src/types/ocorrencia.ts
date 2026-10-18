export type StatusOcorrencia =
  | "ENVIADA"
  | "EM_ANALISE"
  | "EM_ANDAMENTO"
  | "RESOLVIDA";

// ACRESCENTADO: define os dados de cada registro do histórico.
export interface HistoricoStatus {
  // ACRESCENTADO: null indica que este é o registro inicial.
  statusAnterior: StatusOcorrencia | null;

  // ACRESCENTADO: status que a ocorrência passou a ter.
  novoStatus: StatusOcorrencia;

  // ACRESCENTADO: data e hora da alteração no formato ISO.
  alteradoEm: string;
}

export interface OcorrenciaType {
  id: string;
  descricao: string;
  fotoUrl?: string;
  latitude?: number;
  longitude?: number;
  perigosa: boolean;
  status: StatusOcorrencia;
  criadaEm: Date | string;
  imagem: string;
  endereco: string;

  // ACRESCENTADO: lista das mudanças de status da ocorrência.
  // O campo é opcional para manter compatibilidade com os dados existentes.
  historicoStatus?: HistoricoStatus[];
}