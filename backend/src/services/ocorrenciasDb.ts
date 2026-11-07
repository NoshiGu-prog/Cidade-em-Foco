import { sql } from "../database/connection.js";

export async function listarOcorrencias() {
  const ocorrencias = await sql`
    select
      o.id,
      o.usuario_id,
      o.descricao,
      o.tipo,
      o.foto_url,
      o.latitude,
      o.longitude,
      o.perigosa,
      o.imagem,
      o.endereco,
      o.criada_em
    from ocorrencias o
    order by o.criada_em desc
  `;

  return ocorrencias;
}

export interface NovaOcorrencia {
  usuarioId?: string | null;
  descricao: string;
  tipo:
    | "BURACO"
    | "ILUMINACAO"
    | "ARBORIZACAO"
    | "SANEAMENTO"
    | "LIMPEZA"
    | "ELETRICA"
    | "TRANSITO"
    | "OUTROS";
  fotoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  perigosa?: boolean;
  imagem?: string | null;
  endereco: string;
}

export async function criarOcorrencia(dados: NovaOcorrencia) {
  const [ocorrencia] = await sql`
    insert into ocorrencias (
      usuario_id,
      descricao,
      tipo,
      foto_url,
      latitude,
      longitude,
      perigosa,
      imagem,
      endereco
    )
    values (
      ${dados.usuarioId ?? null},
      ${dados.descricao},
      ${dados.tipo},
      ${dados.fotoUrl ?? null},
      ${dados.latitude ?? null},
      ${dados.longitude ?? null},
      ${dados.perigosa ?? false},
      ${dados.imagem ?? null},
      ${dados.endereco}
    )
    returning *
  `;

  await sql`
    insert into historico_status (
      ocorrencia_id,
      status_anterior,
      novo_status
    )
    values (
      ${ocorrencia.id},
      null,
      'ENVIADA'
    )
  `;

  return ocorrencia;
}

export type StatusOcorrencia =
  | "ENVIADA"
  | "EM_ANALISE"
  | "EM_ANDAMENTO"
  | "RESOLVIDA";

export async function atualizarStatusOcorrencia(
  ocorrenciaId: string,
  novoStatus: StatusOcorrencia
) {
  const [ultimoStatus] = await sql`
    select novo_status
    from historico_status
    where ocorrencia_id = ${ocorrenciaId}
    order by alterado_em desc
    limit 1
  `;

  if (!ultimoStatus) {
    throw new Error("Histórico da ocorrência não encontrado.");
  }

  const statusAnterior = ultimoStatus.novo_status;

  const [historico] = await sql`
    insert into historico_status (
      ocorrencia_id,
      status_anterior,
      novo_status
    )
    values (
      ${ocorrenciaId},
      ${statusAnterior},
      ${novoStatus}
    )
    returning *
  `;

  return historico;
}

export async function obterHistoricoOcorrencia(ocorrenciaId: string) {
  return sql`
    select
      id,
      status_anterior,
      novo_status,
      alterado_em
    from historico_status
    where ocorrencia_id = ${ocorrenciaId}
    order by alterado_em asc
  `;
}