export async function gerarDescricaoIaMock(
  descricaoOriginal: string,
): Promise<string> {
  await new Promise((resolve) => setTimeout(resolve, 1200));

  const descricao = descricaoOriginal.trim();

  if (!descricao) {
    throw new Error("Informe uma descrição antes de solicitar uma sugestão.");
  }

  return `Ocorrência identificada no local: ${descricao}. Recomenda-se avaliação da situação para verificar os riscos e as providências necessárias.`;
}