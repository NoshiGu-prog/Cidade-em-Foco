import { GoogleGenAI } from "@google/genai";

export async function gerarDescricao(
  descricaoOriginal: string,
  imagemBase64?: string,
  imagemMimeType = "image/jpeg",
): Promise<string> {
  const descricao = descricaoOriginal.trim();

  if (!imagemBase64) {
    throw new Error("A imagem não pode estar vazia.");
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("A variável GEMINI_API_KEY não está configurada.");
  }

  const ai = new GoogleGenAI({ apiKey });
  const contextoUsuario = descricao
    ? `Descrição informada pelo usuário: "${descricao}".`
    : "O usuário não informou uma descrição adicional.";

  const result = await ai.models.generateContent({
    model: "gemini-3.5-flash-lite",
    contents: [
      {
        text:
          "Analise a imagem de uma ocorrência urbana. " +
          `${contextoUsuario} ` +
          "Escreva em terceira pessoa uma descrição curta e objetiva em português. " +
          "Descreva somente o problema e os elementos realmente visíveis na imagem. " +
          "Use a descrição do usuário apenas como contexto e não invente localização, causa, tamanho, dano ou risco que não esteja claro na imagem. " +
          "Não use listas, títulos ou texto introdutório. Retorne apenas um parágrafo.",
      },
      {
        inlineData: {
          data: imagemBase64,
          mimeType: imagemMimeType,
        },
      },
    ],
  });

  const sugestao = result.text?.trim();
  if (!sugestao) {
    throw new Error("A IA não conseguiu interpretar a imagem.");
  }

  return sugestao;
}