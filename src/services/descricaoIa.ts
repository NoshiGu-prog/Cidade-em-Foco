export async function gerarDescricaoComIa(
  descricaoOriginal: string,
  imagemBase64: string,
  imagemMimeType = "image/jpeg",
): Promise<string> {
  const resposta = await fetch("http://localhost:3333/gerar-descricao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao: descricaoOriginal,
      imagemBase64,
      imagemMimeType,
    }),
  });

  if (!resposta.ok) {
    const dadosErro: unknown = await resposta.json().catch(() => null);
    const mensagem =
      typeof dadosErro === "object" &&
      dadosErro !== null &&
      "erro" in dadosErro &&
      typeof dadosErro.erro === "string"
        ? dadosErro.erro
        : "Erro ao gerar descrição.";
    throw new Error(mensagem);
  }

  const dados = await resposta.json();

  return dados.sugestao;
}