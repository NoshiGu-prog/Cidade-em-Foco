import type { OcorrenciaType } from "../types/ocorrencia";
import { calculateDistanceInMeters } from "./distancia";

// Item 10: distância máxima entre dois registros para ligá-los ao mesmo grupo.
export const RAIO_AGRUPAMENTO_METROS = 100;

function obterCoordenadas({ latitude, longitude }: OcorrenciaType) {
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    Math.abs(latitude) > 90 ||
    Math.abs(longitude) > 180
  ) {
    return null;
  }

  return { lat: latitude, lng: longitude };
}

// Item 10: identifica grupos por tipo de ocorrência e proximidade.
export function agruparOcorrenciasSemelhantes(
  ocorrencias: readonly OcorrenciaType[],
): OcorrenciaType[][] {
  const pendentes = new Set(
    ocorrencias.flatMap((ocorrencia) => {
      const coordenadas = obterCoordenadas(ocorrencia);
      return coordenadas ? [{ ocorrencia, coordenadas }] : [];
    }),
  );

  const grupos: OcorrenciaType[][] = [];

  for (const inicial of pendentes) {
    pendentes.delete(inicial);
    const grupo = [inicial];

    // Cada registro adicionado também pode ligar novos vizinhos ao grupo.
    for (const atual of grupo) {
      for (const candidato of pendentes) {
        if (candidato.ocorrencia.tipo !== atual.ocorrencia.tipo) continue;

        const distancia = calculateDistanceInMeters(
          atual.coordenadas,
          candidato.coordenadas,
        );

        if (distancia !== null && distancia <= RAIO_AGRUPAMENTO_METROS) {
          grupo.push(candidato);
          pendentes.delete(candidato);
        }
      }
    }

    if (grupo.length > 1) {
      grupos.push(grupo.map(({ ocorrencia }) => ocorrencia));
    }
  }

  return grupos.sort((a, b) => b.length - a.length);
}
