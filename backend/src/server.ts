import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { gerarDescricao } from "./services/descricaoIa.js";

dotenv.config();

const app = express();
const PORT = 3333;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    mensagem: "Backend Cidade em Foco funcionando",
  });
});

app.post("/gerar-descricao", async (req, res) => {
  const { descricao } = req.body;

  if (!descricao || typeof descricao !== "string") {
    return res.status(400).json({
      erro: "Informe uma descrição válida.",
    });
  }

  try {
    const sugestao = await gerarDescricao(descricao);

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