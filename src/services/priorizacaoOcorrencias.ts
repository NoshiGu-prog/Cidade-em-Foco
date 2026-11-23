import { API_URL } from "../config/api";

import type {
  OcorrenciaPrioritizada,
  OcorrenciaType,
} from "../types/ocorrencia";

export async function priorizarNoBackend(
  ocorrencias: OcorrenciaType[],
): Promise<OcorrenciaPrioritizada[]> {
  const resposta = await fetch(`${API_URL}/ocorrencias/priorizadas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ocorrencias }),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível priorizar as ocorrências.");
  }

  const dados: unknown = await resposta.json();

  if (
    typeof dados !== "object" ||
    dados === null ||
    !("ocorrencias" in dados) ||
    !Array.isArray(dados.ocorrencias)
  ) {
    throw new Error("O backend retornou dados de priorização inválidos.");
  }

  return dados.ocorrencias as OcorrenciaPrioritizada[];
}
