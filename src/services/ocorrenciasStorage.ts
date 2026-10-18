import AsyncStorage from "@react-native-async-storage/async-storage";
import type { OcorrenciaType } from "../types/ocorrencia";

const OCORRENCIAS_KEY = "cidade-em-foco.ocorrencias.v1";

// ACRESCENTADO: tipo da função que recebe as ocorrências atualizadas.
type OuvinteOcorrencias = (ocorrencias: OcorrenciaType[]) => void;

// ACRESCENTADO: guarda as funções das telas interessadas nas mudanças.
const ouvintes = new Set<OuvinteOcorrencias>();

// ACRESCENTADO: permite que uma tela acompanhe as atualizações.
// Retorna uma função para cancelar a assinatura ao sair da tela.
export function assinarAtualizacoesOcorrencias(
  ouvinte: OuvinteOcorrencias,
): () => void {
  ouvintes.add(ouvinte);

  return () => {
    ouvintes.delete(ouvinte);
  };
}

export async function salvarOcorrencias(
  ocorrencias: OcorrenciaType[],
): Promise<void> {
  await AsyncStorage.setItem(
    OCORRENCIAS_KEY,
    JSON.stringify(ocorrencias),
  );

  // ACRESCENTADO: avisa as telas somente após salvar com sucesso.
  // A falha de um ouvinte não impede os demais de receber a atualização
  // e não faz um salvamento concluído ser tratado como falha.
  ouvintes.forEach((ouvinte) => {
    try {
      ouvinte(ocorrencias);
    } catch (erro) {
      console.error("Erro ao notificar atualização de ocorrências:", erro);
    }
  });
}

export async function carregarOcorrencias(): Promise<
  OcorrenciaType[] | null
> {
  const dadosSalvos = await AsyncStorage.getItem(OCORRENCIAS_KEY);

  if (dadosSalvos === null) {
    return null;
  }

  const dados: unknown = JSON.parse(dadosSalvos);

  if (!Array.isArray(dados)) {
    throw new Error("Os dados locais das ocorrências são inválidos.");
  }

  // Mantido: esta conversão não valida cada campo da ocorrência.
  return dados as OcorrenciaType[];
}