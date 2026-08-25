export type StatusOcorrencia =
  | 'ENVIADA'
  | 'EM_ANALISE'
  | 'EM_ANDAMENTO'
  | 'RESOLVIDA';

export interface Ocorrencia {
  id: string;
  descricao: string;
  fotoUrl?: string;
  latitude?: number;
  longitude?: number;
  perigosa: boolean;
  status: StatusOcorrencia;
  criadaEm: string;
}
