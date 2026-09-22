export async function gerarDescricaoComIa(
  descricaoOriginal: string,
): Promise<string> {
  const resposta = await fetch("http://localhost:3333/gerar-descricao", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      descricao: descricaoOriginal,
    }),
  });

  if (!resposta.ok) {
    throw new Error("Erro ao gerar descrição.");
  }

  const dados = await resposta.json();

  return dados.sugestao;
}