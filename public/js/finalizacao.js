import { calcularTotal, lerCarrinho, limparCarrinho } from "./armazenamento.js";
import { criarElemento, criarLink, formatarPreco, montarPagina, mostrarCarrinhoVazio } from "./componentes.js";

const { principal, atualizarContador } = montarPagina("Finalização da compra");
const pedido = lerCarrinho();
const carrinhoInicial = JSON.stringify(pedido);

function criarResumo() {
  const secao = criarElemento("section", "col-12 col-lg-6");
  const titulo = criarElemento("h2", "h5 mb-3", "Resumo do pedido");
  const lista = criarElemento("ul", "list-group mb-3");

  for (const item of pedido) {
    const linha = criarElemento("li", "list-group-item d-flex flex-wrap justify-content-between gap-2");
    const nome = criarElemento("span", "", `${item.quantidade} × ${item.title} (${formatarPreco(item.price)} cada)`);
    const subtotal = criarElemento("strong", "", formatarPreco(item.price * item.quantidade));
    linha.append(nome, subtotal);
    lista.append(linha);
  }

  const total = criarElemento("p", "h5 mb-0", `Total: ${formatarPreco(calcularTotal(pedido))}`);
  secao.append(titulo, lista, total);
  return secao;
}

function criarFormulario() {
  const secao = criarElemento("section", "col-12 col-lg-6");
  const titulo = criarElemento("h2", "h5 mb-3", "Entrega e pagamento");
  const formulario = criarElemento("form", "bg-white border rounded p-3 p-md-4");

  const campoEndereco = criarElemento("div", "mb-3");
  const rotuloEndereco = criarElemento("label", "form-label", "Endereço de entrega");
  const endereco = criarElemento("input", "form-control");
  endereco.id = "endereco";
  endereco.type = "text";
  endereco.required = true;
  endereco.autocomplete = "street-address";
  rotuloEndereco.htmlFor = endereco.id;
  endereco.addEventListener("input", () => endereco.setCustomValidity(""));
  campoEndereco.append(rotuloEndereco, endereco);

  const campoPagamento = criarElemento("div", "mb-3");
  const rotuloPagamento = criarElemento("label", "form-label", "Método de pagamento");
  const pagamento = criarElemento("select", "form-select");
  pagamento.id = "pagamento";
  pagamento.required = true;
  rotuloPagamento.htmlFor = pagamento.id;

  const escolha = criarElemento("option", "", "Selecione um método");
  escolha.value = "";
  escolha.disabled = true;
  escolha.selected = true;
  pagamento.append(escolha);

  for (const metodo of ["Cartão de crédito", "Boleto", "PIX"]) {
    const opcao = criarElemento("option", "", metodo);
    opcao.value = metodo;
    pagamento.append(opcao);
  }

  campoPagamento.append(rotuloPagamento, pagamento);

  const aviso = criarElemento("p", "alert alert-warning", "O carrinho mudou. Volte ao carrinho para revisar o pedido.");
  aviso.setAttribute("role", "alert");
  aviso.hidden = true;
  const acoes = criarElemento("div", "d-flex flex-wrap gap-2");
  const finalizar = criarElemento("button", "btn btn-dark", "Finalizar");
  finalizar.type = "submit";
  const voltar = criarLink("Voltar ao carrinho", "./carrinho.html", "btn btn-outline-secondary");
  acoes.append(finalizar, voltar);
  formulario.append(campoEndereco, campoPagamento, aviso, acoes);
  secao.append(titulo, formulario);

  formulario.addEventListener("submit", (evento) => {
    evento.preventDefault();

    if (endereco.value.trim() === "") {
      endereco.setCustomValidity("Informe o endereço de entrega.");
      endereco.reportValidity();
      return;
    }

    if (JSON.stringify(lerCarrinho()) !== carrinhoInicial) {
      aviso.hidden = false;
      return;
    }

    limparCarrinho();
    atualizarContador();
    mostrarConfirmacao(secao);
  });

  return secao;
}

function mostrarConfirmacao(secao) {
  const mensagem = criarElemento("div", "alert alert-success");
  const titulo = criarElemento("h2", "h5 mb-0", "Seu pedido foi finalizado.");
  titulo.tabIndex = -1;
  const link = criarLink("Voltar ao cardápio", "./", "btn btn-dark");
  mensagem.append(titulo);
  secao.replaceChildren(mensagem, link);
  titulo.focus();
}

if (pedido.length === 0) {
  mostrarCarrinhoVazio(principal);
} else {
  const colunas = criarElemento("div", "row g-4");
  colunas.append(criarResumo(), criarFormulario());
  principal.append(colunas);
}
