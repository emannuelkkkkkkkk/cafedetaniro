import { buscarCafes } from "./api.js";
import { adicionarCafe } from "./armazenamento.js";
import { criarElemento, formatarPreco, montarPagina } from "./componentes.js";

const { principal, atualizarContador } = montarPagina("Cardápio de cafés");
const aviso = criarElemento("p", "mb-0", "Carregando os cafés…");
aviso.setAttribute("role", "status");
const grade = criarElemento("div", "row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4");
principal.append(aviso, grade);
let ultimoAviso = null;

function criarCard(cafe) {
  const coluna = criarElemento("div", "col");
  const card = criarElemento("article", "card h-100");
  const foto = criarElemento("img", "card-img-top foto-cafe");
  foto.alt = cafe.title;
  foto.width = 800;
  foto.height = 480;
  foto.addEventListener("error", () => {
    const alternativa = criarElemento("div", "foto-cafe d-flex align-items-center justify-content-center", "Imagem indisponível");
    foto.replaceWith(alternativa);
  });
  foto.src = cafe.image;

  const corpo = criarElemento("div", "card-body d-flex flex-column");
  const nome = criarElemento("h2", "card-title h5", cafe.title);
  const descricao = criarElemento("p", "card-text", cafe.description);
  const ingredientes = criarElemento("p", "card-text text-body-secondary small", `Ingredientes: ${cafe.ingredients.join(", ")}`);
  const preco = criarElemento("p", "mt-auto mb-3 fw-bold", formatarPreco(cafe.price));
  const botao = criarElemento("button", "btn btn-dark align-self-start", "Adicionar ao carrinho");
  const avisoCarrinho = criarElemento("p", "text-success small mb-0 mt-2");
  avisoCarrinho.setAttribute("role", "status");
  botao.type = "button";
  botao.setAttribute("aria-label", `Adicionar ao carrinho: ${cafe.title}`);
  botao.addEventListener("click", () => {
    adicionarCafe(cafe);
    atualizarContador();

    if (ultimoAviso) {
      ultimoAviso.textContent = "";
    }

    avisoCarrinho.textContent = `${cafe.title} adicionado ao carrinho.`;
    ultimoAviso = avisoCarrinho;
  });

  corpo.append(nome, descricao, ingredientes, preco, botao, avisoCarrinho);
  card.append(foto, corpo);
  coluna.append(card);
  return coluna;
}

async function carregarCatalogo() {
  try {
    const cafes = await buscarCafes();

    if (cafes.length === 0) {
      aviso.textContent = "Nenhum café disponível no momento.";
      return;
    }

    aviso.textContent = "";

    for (const cafe of cafes) {
      grade.append(criarCard(cafe));
    }
  } catch {
    aviso.className = "alert alert-danger";
    aviso.textContent = "Não foi possível carregar os cafés. Confira se a API está rodando e recarregue a página.";
  }
}

carregarCatalogo();
