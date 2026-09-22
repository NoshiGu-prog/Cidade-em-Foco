import cors from "cors";
import dotenv from "dotenv";
import express from "express";

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

app.post("/gerar-descricao", (req, res) => {
  const { descricao } = req.body;

  if (!descricao || typeof descricao !== "string") {
    return res.status(400).json({
      erro: "Informe uma descrição válida.",
    });
  }

  const sugestao =
    `Ocorrência identificada no local: ${descricao.trim()}. ` +
    "Recomenda-se avaliação da situação para verificar os riscos e as providências necessárias.";

  return res.json({
    sugestao,
  });
});

app.listen(PORT, () => {
  console.log(`Backend rodando em http://localhost:${PORT}`);
});