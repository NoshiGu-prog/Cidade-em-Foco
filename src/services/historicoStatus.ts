// ACRESCENTADO: importa os tipos da ocorrência e do histórico.
import type {
  HistoricoStatus,
  OcorrenciaType,
  StatusOcorrencia,
} from "../types/ocorrencia";

export function obterStatusAtual(
  ocorrencia: Pick<OcorrenciaType, "historicoStatus">,
): StatusOcorrencia {
  let alteracaoMaisRecente: HistoricoStatus | undefined;
  let dataMaisRecente = Number.NEGATIVE_INFINITY;

  for (const alteracao of ocorrencia.historicoStatus ?? []) {
    const dataAlteracao = new Date(alteracao.alteradoEm).getTime();

    if (Number.isFinite(dataAlteracao) && dataAlteracao >= dataMaisRecente) {
      alteracaoMaisRecente = alteracao;
      dataMaisRecente = dataAlteracao;
    }
  }

  console.log(
    "alteracaoMaisRecente?.novoStatus",
    alteracaoMaisRecente?.novoStatus,
  );

  return alteracaoMaisRecente?.novoStatus ?? "ENVIADA";
}

// ACRESCENTADO: atualiza o status e acrescenta uma entrada no histórico.
// A função retorna um novo objeto, sem modificar a ocorrência original.
export function atualizarStatusOcorrencia(
  ocorrencia: OcorrenciaType,
  novoStatus: StatusOcorrencia,
): OcorrenciaType {
  // ACRESCENTADO: não registra alteração se o status continuar igual.
  const statusAtual = obterStatusAtual(ocorrencia);

  if (statusAtual === novoStatus) {
    return ocorrencia;
  }

  // ACRESCENTADO: registra o status anterior, o novo e a data atual.
  const alteracao: HistoricoStatus = {
    statusAnterior: statusAtual,
    novoStatus,
    alteradoEm: new Date().toISOString(),
  };

  // ACRESCENTADO: mantém o histórico existente.
  // Ocorrências sem histórico começam com uma lista vazia.
  const historicoAnterior = ocorrencia.historicoStatus ?? [];

  // ACRESCENTADO: atualiza o status e adiciona a mudança ao histórico.
  return {
    ...ocorrencia,
    historicoStatus: [...historicoAnterior, alteracao],
  };
}
