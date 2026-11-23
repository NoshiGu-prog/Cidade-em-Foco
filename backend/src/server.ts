import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { gerarDescricao } from "./services/descricaoIa.js";
import { priorizarLista } from "./services/priorizacaoOcorrencias.js";

import {
  atualizarStatusOcorrencia,
  criarOcorrencia,
  listarOcorrencias,
  obterHistoricoOcorrencia,
} from "./services/ocorrenciasDb.js";


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

app.get("/ocorrencias", async (_req, res) => {
  try {
    const ocorrencias = await listarOcorrencias();

    return res.json(ocorrencias);
  } catch (erro) {
    console.error("Erro ao buscar ocorrências:", erro);

    return res.status(500).json({
      erro: "Não foi possível buscar as ocorrências.",
    });
  }
});

app.post("/ocorrencias", async (req, res) => {
  const {
    usuarioId,
    descricao,
    tipo,
    fotoUrl,
    latitude,
    longitude,
    perigosa,
    imagem,
    endereco,
  } = req.body;

  if (!descricao || !tipo || !endereco) {
    return res.status(400).json({
      erro: "Descrição, tipo e endereço são obrigatórios.",
    });
  }

  try {
    const ocorrencia = await criarOcorrencia({
      usuarioId,
      descricao,
      tipo,
      fotoUrl,
      latitude,
      longitude,
      perigosa,
      imagem,
      endereco,
    });

    return res.status(201).json(ocorrencia);
  } catch (erro) {
    console.error("Erro ao criar ocorrência:", erro);

    return res.status(500).json({
      erro: "Não foi possível criar a ocorrência.",
    });
  }
});

app.patch("/ocorrencias/:id/status", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusValidos = [
    "ENVIADA",
    "EM_ANALISE",
    "EM_ANDAMENTO",
    "RESOLVIDA",
  ];

  if (!statusValidos.includes(status)) {
    return res.status(400).json({
      erro: "Status inválido.",
    });
  }

  try {
    const historico = await atualizarStatusOcorrencia(id, status);

    return res.json(historico);
  } catch (erro) {
    console.error("Erro ao atualizar status:", erro);

    return res.status(500).json({
      erro: "Não foi possível atualizar o status.",
    });
  }
});

app.get("/ocorrencias/:id/historico", async (req, res) => {
  try {
    const historico = await obterHistoricoOcorrencia(req.params.id);
    return res.json(historico);
  } catch (erro) {
    console.error("Erro ao buscar histórico:", erro);

    return res.status(500).json({
      erro: "Não foi possível buscar o histórico.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});