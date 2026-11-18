type PrioridadeOcorrencia = "CRITICA" | "ALTA" | "MEDIA" | "BAIXA";

type Ocorrencia = {
  id: string;
  tipo: string;
  perigosa: boolean;
  criadaEm: string | Date;
  latitude?: number;
  longitude?: number;
  endereco: string;
};

export type OcorrenciaPrioritizada = {
  ocorrencia: Ocorrencia;
  prioridade: PrioridadeOcorrencia;
  chamadosNaRegiao: number;
  chamadosPerigosos: number;
  chamadosRecentes: number;
};

const raioRegiaoMetros = 1000;
const janelaRecorrenciaDias = 30;
const milissegundosPorDia = 24 * 60 * 60 * 1000;

function normalizarTexto(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLocaleLowerCase("pt-BR");
}

function obterRegiao(endereco: string): string {
  const partesHifen = endereco.split(" - ");
  if (partesHifen.length > 1) {
    return normalizarTexto(partesHifen[partesHifen.length - 1]);
  }

  const partesEndereco = endereco.split(",").map((parte) => parte.trim());
  if (partesEndereco.length > 1) {
    return normalizarTexto(partesEndereco[partesEndereco.length - 2]);
  }

  return normalizarTexto(endereco);
}

function distanciaMetros(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number,
): number {
  const radianos = (graus: number) => (graus * Math.PI) / 180;
  const diferencaLatitude = radianos(latitudeB - latitudeA);
  const diferencaLongitude = radianos(longitudeB - longitudeA);
  const a =
    Math.sin(diferencaLatitude / 2) ** 2 +
    Math.cos(radianos(latitudeA)) *
      Math.cos(radianos(latitudeB)) *
      Math.sin(diferencaLongitude / 2) ** 2;

  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estaNaMesmaRegiao(atual: Ocorrencia, candidata: Ocorrencia): boolean {
  const coordenadasValidas =
    Number.isFinite(atual.latitude) &&
    Number.isFinite(atual.longitude) &&
    Number.isFinite(candidata.latitude) &&
    Number.isFinite(candidata.longitude);

  if (coordenadasValidas) {
    return (
      distanciaMetros(
        atual.latitude!,
        atual.longitude!,
        candidata.latitude!,
        candidata.longitude!,
      ) <= raioRegiaoMetros
    );
  }

  const regiaoAtual = obterRegiao(atual.endereco);
  return Boolean(regiaoAtual) && regiaoAtual === obterRegiao(candidata.endereco);
}

function dentroDaJanelaDeRecorrencia(
  criadaEm: string | Date,
  agora: number,
): boolean {
  const data = new Date(criadaEm).getTime();
  const idadeEmDias = (agora - data) / milissegundosPorDia;

  return (
    Number.isFinite(data) &&
    idadeEmDias >= 0 &&
    idadeEmDias <= janelaRecorrenciaDias
  );
}

function calcularPrioridade(
  chamadosNaRegiao: number,
  chamadosPerigosos: number,
  chamadosRecentes: number,
): PrioridadeOcorrencia {
  if (chamadosNaRegiao >= 5 && chamadosPerigosos >= 3) {
    return "CRITICA";
  }

  if (
    chamadosPerigosos === 1 ||
    chamadosRecentes >= 3 ||
    chamadosNaRegiao >= 5
  ) {
    return "ALTA";
  }

  if (chamadosNaRegiao >= 2 || chamadosRecentes >= 2) {
    return "MEDIA";
  }

  return "BAIXA";
}

export function priorizarLista(
  ocorrencias: Ocorrencia[],
  agora = Date.now(),
): OcorrenciaPrioritizada[] {
  return ocorrencias
    .map((ocorrencia) => {
      const chamadasRelacionadas = ocorrencias.filter(
        (candidata) =>
          candidata.tipo === ocorrencia.tipo &&
          estaNaMesmaRegiao(ocorrencia, candidata),
      );
      const chamadosNaRegiao = chamadasRelacionadas.length;
      const chamadosPerigosos = chamadasRelacionadas.filter(
        (chamada) => chamada.perigosa,
      ).length;
      const chamadosRecentes = chamadasRelacionadas.filter((chamada) =>
        dentroDaJanelaDeRecorrencia(chamada.criadaEm, agora),
      ).length;

      return {
        ocorrencia,
        prioridade: calcularPrioridade(
          chamadosNaRegiao,
          chamadosPerigosos,
          chamadosRecentes,
        ),
        chamadosNaRegiao,
        chamadosPerigosos,
        chamadosRecentes,
      };
    })
    .sort((a, b) => {
      const ordem: Record<PrioridadeOcorrencia, number> = {
        CRITICA: 0,
        ALTA: 1,
        MEDIA: 2,
        BAIXA: 3,
      };

      return (
        ordem[a.prioridade] - ordem[b.prioridade] ||
        new Date(b.ocorrencia.criadaEm).getTime() -
          new Date(a.ocorrencia.criadaEm).getTime()
      );
    });
}
