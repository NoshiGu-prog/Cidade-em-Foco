import { GoogleGenAI, Type } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const systemInstruction = `
Você faz a triagem de ocorrências urbanas. Classifique como CRITICA apenas quando houver risco físico, estrutural ou parada total; ALTA quando afetar múltiplos usuários ou áreas; MEDIA quando houver impacto parcial; e BAIXA para dúvidas ou melhorias.
Use somente as informações fornecidas, seja objetivo na justificativa e descreva a categoria com poucas palavras.
`;

const prioridades = ["BAIXA", "MEDIA", "ALTA", "CRITICA"] as const;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    prioridade: {
      type: Type.STRING,
      enum: [...prioridades],
    },
    categoria: {
      type: Type.STRING,
      description: "Identificação curta do tipo de problema.",
    },
    justificativa: {
      type: Type.STRING,
      description: "Motivo objetivo para a prioridade escolhida.",
    },
  },
  required: ["prioridade", "categoria", "justificativa"],
  propertyOrdering: ["prioridade", "categoria", "justificativa"],
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Max-Age", "86400");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ erro: "Método não permitido." });
    return;
  }

  const body: unknown = req.body;
  if (!isRecord(body)) {
    res.status(400).json({ erro: "Envie um JSON com título e descrição." });
    return;
  }

  const { titulo, descricao } = body;
  if (
    typeof titulo !== "string" ||
    !titulo.trim() ||
    typeof descricao !== "string" ||
    !descricao.trim()
  ) {
    res.status(400).json({
      erro: "Título e descrição devem ser textos não vazios.",
    });
    return;
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("A variável GEMINI_API_KEY não está configurada.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const result = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `Título: ${titulo.trim()}\nDescrição: ${descricao.trim()}`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
      },
    });

    if (!result.text) {
      throw new Error("O Gemini retornou uma resposta vazia.");
    }

    const output: unknown = JSON.parse(result.text);
    if (
      !isRecord(output) ||
      Object.keys(output).length !== 3 ||
      !prioridades.some((prioridade) => prioridade === output.prioridade) ||
      typeof output.categoria !== "string" ||
      !output.categoria.trim() ||
      typeof output.justificativa !== "string" ||
      !output.justificativa.trim()
    ) {
      throw new Error("O Gemini retornou dados fora do formato esperado.");
    }

    res.status(200).json({
      prioridade: output.prioridade,
      categoria: output.categoria,
      justificativa: output.justificativa,
    });
  } catch (error) {
    console.error("Erro ao priorizar ocorrência:", error);
    res.status(500).json({ erro: "Não foi possível priorizar a ocorrência." });
  }
}
