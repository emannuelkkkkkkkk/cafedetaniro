import { contarUnidades, lerCarrinho } from "./armazenamento.js";

export function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function criarElemento(tag, classes = "", texto = "") {
  const elemento = document.createElement(tag);
  elemento.className = classes;
  elemento.textContent = texto;
  return elemento;
}

export function criarLink(texto, destino, classes) {
  const link = criarElemento("a", classes, texto);
  link.href = destino;
  return link;
}

export function montarPagina(titulo) {
  const cabecalho = criarElemento("header", "navbar navbar-cafe");
  const navegacao = criarElemento("nav", "container py-1");
  navegacao.setAttribute("aria-label", "Navegação principal");

  const marca = criarLink("Loja de Cafés", "./", "navbar-brand text-white me-0");
  const linkCarrinho = criarLink("", "./carrinho.html", "btn btn-outline-light d-flex align-items-center gap-2");
  const icone = criarElemento("span", "", "🛒");
  icone.setAttribute("aria-hidden", "true");
  const contador = criarElemento("span", "badge text-bg-light");

  linkCarrinho.append(icone, "Carrinho", contador);
  navegacao.append(marca, linkCarrinho);
  cabecalho.append(navegacao);

  const principal = criarElemento("main", "container py-4 py-md-5");
  const tituloPagina = criarElemento("h1", "h2 mb-4", titulo);
  tituloPagina.tabIndex = -1;
  principal.append(tituloPagina);
  document.getElementById("root").append(cabecalho, principal);

  function atualizarContador() {
    const unidades = contarUnidades(lerCarrinho());
    contador.textContent = unidades;
    const palavra = unidades === 1 ? "unidade" : "unidades";
    linkCarrinho.setAttribute("aria-label", `Carrinho, ${unidades} ${palavra}`);
  }

  atualizarContador();
  window.addEventListener("storage", atualizarContador);
  window.addEventListener("pageshow", atualizarContador);

  return { principal, tituloPagina, atualizarContador };
}

export function mostrarCarrinhoVazio(destino) {
  const aviso = criarElemento("p", "alert alert-light border", "Seu carrinho está vazio. Adicione um café para continuar.");
  destino.append(aviso, criarLink("Ver cafés", "./", "btn btn-dark"));
}
