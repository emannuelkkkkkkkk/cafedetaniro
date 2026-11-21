const CHAVE_CARRINHO = "carrinhoCafes";

export function lerCarrinho() {
  const dados = localStorage.getItem(CHAVE_CARRINHO);

  try {
    const itens = JSON.parse(dados);
    return Array.isArray(itens) ? itens : [];
  } catch {
    return [];
  }
}

function salvarCarrinho(itens) {
  if (itens.length === 0) {
    limparCarrinho();
    return;
  }

  localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(itens));
}

export function adicionarCafe(cafe) {
  const itens = lerCarrinho();
  const item = itens.find((item) => item.id === cafe.id);

  if (item) {
    item.quantidade += 1;
  } else {
    itens.push({ id: cafe.id, title: cafe.title, price: cafe.price, quantidade: 1 });
  }

  salvarCarrinho(itens);
}

export function alterarQuantidade(id, diferenca) {
  const itens = lerCarrinho();
  const indice = itens.findIndex((item) => item.id === id);

  if (indice === -1) {
    return;
  }

  itens[indice].quantidade += diferenca;

  if (itens[indice].quantidade === 0) {
    itens.splice(indice, 1);
  }

  salvarCarrinho(itens);
}

export function contarUnidades(itens) {
  let quantidade = 0;

  for (const item of itens) {
    quantidade += item.quantidade;
  }

  return quantidade;
}

export function calcularTotal(itens) {
  let total = 0;

  for (const item of itens) {
    total += item.price * item.quantidade;
  }

  return total;
}

export function limparCarrinho() {
  localStorage.removeItem(CHAVE_CARRINHO);
}
