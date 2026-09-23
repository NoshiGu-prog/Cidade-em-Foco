export async function gerarDescricao(
  descricaoOriginal: string,
): Promise<string> {
  const descricao = descricaoOriginal.trim();

  if (!descricao) {
    throw new Error("A descrição não pode estar vazia.");
  }

  return (
    `Ocorrência identificada no local: ${descricao}. ` +
    "Recomenda-se avaliação da situação para verificar os riscos e as providências necessárias."
  );
}