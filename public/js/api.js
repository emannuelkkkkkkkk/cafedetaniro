export async function buscarCafes() {
  const resposta = await fetch("/cafes");

  if (!resposta.ok) {
    throw new Error(`A API respondeu com o código ${resposta.status}.`);
  }

  return resposta.json();
}
