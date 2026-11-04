export type Produto = {
  id_produto: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  ativo: boolean;
  criado_em?: string;
};

const API_URL = "https://precifygo-production.up.railway.app/produtos";

async function verificarResposta(response: Response) {
  if (!response.ok) {
    const erro = await response.json().catch(() => null);
    throw new Error(erro?.error || "Erro ao comunicar com a API");
  }

  return response;
}

export async function listarProdutos(): Promise<Produto[]> {
  const response = await verificarResposta(await fetch(API_URL));
  return response.json();
}

export async function criarProduto(
  produto: Omit<Produto, "id_produto" | "criado_em">
): Promise<Produto> {
  const response = await verificarResposta(
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto),
    })
  );

  return response.json();
}

export async function excluirProduto(id: number): Promise<void> {
  await verificarResposta(
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantidade }),
    })
  );

  const resultado = await response.json();

  return resultado.produto;
}