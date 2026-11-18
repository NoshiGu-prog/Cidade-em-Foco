import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { gerarDescricao } from "./services/descricaoIa.js";
import { priorizarLista } from "./services/priorizacaoOcorrencias.js";

const backendRoot = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(backendRoot, "../.env") });

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    mensagem: "Backend Cidade em Foco funcionando",
  });
});

app.post("/ocorrencias/priorizadas", (req, res) => {
  const { ocorrencias } = req.body ?? {};

  if (!Array.isArray(ocorrencias)) {
    return res.status(400).json({
      erro: "Envie uma lista válida de ocorrências.",
    });
  }

  const ocorrenciasPrioritizadas = priorizarLista(ocorrencias);

  return res.json({
    ocorrencias: ocorrenciasPrioritizadas,
  });
});

app.post("/gerar-descricao", async (req, res) => {
  const { descricao, imagemBase64, imagemMimeType } = req.body;

  if (typeof descricao !== "string") {
    return res.status(400).json({
      erro: "Informe uma descrição válida.",
    });
  }

  if (!imagemBase64 || typeof imagemBase64 !== "string") {
    return res.status(400).json({
      erro: "Envie uma imagem válida.",
    });
  }

  if (imagemMimeType && typeof imagemMimeType !== "string") {
    return res.status(400).json({
      erro: "O formato da imagem é inválido.",
    });
  }

  try {
    const sugestao = await gerarDescricao(
      descricao,
      imagemBase64,
      typeof imagemMimeType === "string" ? imagemMimeType : "image/jpeg",
    );

    return res.json({
      sugestao,
    });
  } catch (erro) {
    console.log("Erro ao gerar descrição:", erro);

    return res.status(500).json({
      erro: "Não foi possível gerar uma sugestão.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});