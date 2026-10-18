// ACRESCENTADO: importa os tipos da ocorrência e do histórico.
import type {
  HistoricoStatus,
  OcorrenciaType,
  StatusOcorrencia,
} from "../types/ocorrencia";

// ACRESCENTADO: atualiza o status e acrescenta uma entrada no histórico.
// A função retorna um novo objeto, sem modificar a ocorrência original.
export function atualizarStatusOcorrencia(
  ocorrencia: OcorrenciaType,
  novoStatus: StatusOcorrencia,
): OcorrenciaType {
  // ACRESCENTADO: não registra alteração se o status continuar igual.
  if (ocorrencia.status === novoStatus) {
    return ocorrencia;
  }

  // ACRESCENTADO: registra o status anterior, o novo e a data atual.
  const alteracao: HistoricoStatus = {
    statusAnterior: ocorrencia.status,
    novoStatus,
    alteradoEm: new Date().toISOString(),
  };

  // ACRESCENTADO: mantém o histórico existente.
  // Ocorrências sem histórico começam com uma lista vazia.
  const historicoAnterior = ocorrencia.historicoStatus ?? [];

  // ACRESCENTADO: atualiza o status e adiciona a mudança ao histórico.
  return {
    ...ocorrencia,
    status: novoStatus,
    historicoStatus: [...historicoAnterior, alteracao],
  };
}