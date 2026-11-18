import { OcorrenciaType } from "../types/ocorrencia";

const API_URL = "http://localhost:3333";

interface HistoricoStatusApi {
  status_anterior: OcorrenciaType["historicoStatus"][number]["statusAnterior"];
  novo_status: OcorrenciaType["historicoStatus"][number]["novoStatus"];
  alterado_em: string;
}

interface OcorrenciaApi {
  id: string;
  usuario_id: string | null;
  descricao: string;
  tipo: OcorrenciaType["tipo"];
  foto_url: string | null;
  latitude: number | null;
  longitude: number | null;
  perigosa: boolean;
  imagem: string | null;
  endereco: string;
  criada_em: string;
  historico_status: HistoricoStatusApi[];
}

export async function listarOcorrenciasApi(): Promise<OcorrenciaType[]> {
  const resposta = await fetch(`${API_URL}/ocorrencias`);

  if (!resposta.ok) {
    throw new Error("Não foi possível buscar as ocorrências.");
  }

  const dados: OcorrenciaApi[] = await resposta.json();

  return dados.map((item) => ({
    id: item.id,
    descricao: item.descricao,
    tipo: item.tipo,
    fotoUrl: item.foto_url ?? undefined,
    latitude: item.latitude ?? undefined,
    longitude: item.longitude ?? undefined,
    perigosa: item.perigosa,
    criadaEm: item.criada_em,
    imagem: item.imagem ?? "",
    endereco: item.endereco,

    historicoStatus: item.historico_status.map((historico) => ({
      statusAnterior: historico.status_anterior,
      novoStatus: historico.novo_status,
      alteradoEm: historico.alterado_em,
    })),
  }));
}

export interface NovaOcorrenciaApi {
  usuarioId?: string | null;
  descricao: string;
  tipo: OcorrenciaType["tipo"];
  fotoUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  perigosa?: boolean;
  imagem?: string | null;
  endereco: string;
}

export async function criarOcorrenciaApi(dados: NovaOcorrenciaApi) {
  const resposta = await fetch(`${API_URL}/ocorrencias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dados),
  });

  if (!resposta.ok) {
    throw new Error("Não foi possível registrar a ocorrência.");
  }

  return resposta.json();
}