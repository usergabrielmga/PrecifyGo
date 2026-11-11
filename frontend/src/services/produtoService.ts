
export type Produto = {
  id_produto: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  criado_em?: string;
};

const API_URL = "https://precify-go-3tri.vercel.app/produtos";

// Recupera o token salvo após o login
function obterHeaders(json = true): HeadersInit {
  const token = localStorage.getItem("token");

  return {
    ...(json ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function verificarResposta(response: Response) {
  if (!response.ok) {
    const erro = await response.json().catch(() => null);

    if (response.status === 401) {
      throw new Error("Sessão expirada ou não autorizada. Faça login novamente.");
    }

    throw new Error(erro?.error || "Erro ao comunicar com a API");
  }

  return response;
}

export async function listarProdutos(): Promise<Produto[]> {
  const response = await verificarResposta(
    await fetch(API_URL, {
      method: "GET",
      headers: obterHeaders(false),
    })
  );

  return response.json();
}

export async function criarProduto(
  produto: Omit<Produto, "id_produto" | "criado_em">
): Promise<Produto> {
  const response = await verificarResposta(
    await fetch(API_URL, {
      method: "POST",
      headers: obterHeaders(),
      body: JSON.stringify(produto),
    })
  );

  return response.json();
}

export async function atualizarProduto(
  id: number,
  produto: Omit<Produto, "id_produto" | "criado_em">
): Promise<Produto> {
  const response = await verificarResposta(
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: obterHeaders(),
      body: JSON.stringify(produto),
    })
  );

  return response.json();
}

export async function excluirProduto(id: number): Promise<void> {
  await verificarResposta(
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: obterHeaders(false),
    })
  );
}

// Registrar entrada de estoque em um produto existente
export async function registrarEntradaEstoque(
  produtoId: number,
  quantidade: number
): Promise<Produto> {
  const response = await verificarResposta(
    await fetch(`${API_URL}/${produtoId}/entrada`, {
      method: "POST",
      headers: obterHeaders(),
      body: JSON.stringify({ quantidade }),
    })
  );

  const resultado = await response.json();

  return resultado.produto;
}
