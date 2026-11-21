import { alterarQuantidade, calcularTotal, lerCarrinho } from "./armazenamento.js";
import { criarElemento, criarLink, formatarPreco, montarPagina, mostrarCarrinhoVazio } from "./componentes.js";

const { principal, tituloPagina, atualizarContador } = montarPagina("Carrinho de compras");
const conteudo = criarElemento("div");
principal.append(conteudo);

function criarBotaoQuantidade(item, diferenca, texto, acao) {
  const botao = criarElemento("button", "btn btn-outline-secondary", texto);
  botao.type = "button";
  botao.id = `quantidade-${item.id}-${acao}`;
  botao.setAttribute("aria-label", `${acao} uma unidade de ${item.title}`);
  botao.addEventListener("click", () => {
    alterarQuantidade(item.id, diferenca);
    atualizarContador();
    mostrarCarrinho();

    const elementoFoco = document.getElementById(botao.id) ?? tituloPagina;
    elementoFoco.focus();
  });
  return botao;
}

function criarLinha(item) {
  const linha = criarElemento("li", "list-group-item d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3 p-3");
  const detalhes = criarElemento("div");
  const nome = criarElemento("h2", "h5 mb-1", item.title);
  const precoUnitario = formatarPreco(item.price);
  const subtotal = formatarPreco(item.price * item.quantidade);
  const calculo = criarElemento("p", "mb-0 text-body-secondary", `${item.quantidade} × ${precoUnitario} = ${subtotal}`);
  detalhes.append(nome, calculo);

  const controles = criarElemento("div", "d-flex align-items-center");
  const quantidade = criarElemento("span", "px-3");
  quantidade.append(criarElemento("span", "visually-hidden", "Quantidade: "), String(item.quantidade));
  controles.append(
    criarBotaoQuantidade(item, -1, "−", "Diminuir"),
    quantidade,
    criarBotaoQuantidade(item, 1, "+", "Aumentar")
  );

  linha.append(detalhes, controles);
  return linha;
}

function mostrarCarrinho() {
  const itens = lerCarrinho();
  conteudo.replaceChildren();

  if (itens.length === 0) {
    mostrarCarrinhoVazio(conteudo);
    return;
  }

  const lista = criarElemento("ul", "list-group mb-4");

  for (const item of itens) {
    lista.append(criarLinha(item));
  }

  const resumo = criarElemento("div", "d-flex flex-wrap align-items-center justify-content-between gap-3");
  const total = criarElemento("p", "h5 mb-0", `Total: ${formatarPreco(calcularTotal(itens))}`);
  const acoes = criarElemento("div", "d-flex flex-wrap gap-2");
  const continuar = criarLink("Continuar comprando", "./", "btn btn-outline-secondary");
  const finalizar = criarLink("Finalizar Compra", "./finalizacao.html", "btn btn-dark");
  acoes.append(continuar, finalizar);
  resumo.append(total, acoes);
  conteudo.append(lista, resumo);
}

mostrarCarrinho();
window.addEventListener("storage", mostrarCarrinho);
window.addEventListener("pageshow", (evento) => {
  if (evento.persisted) {
    mostrarCarrinho();
  }
});
