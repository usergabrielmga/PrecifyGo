
export type Servico = {
  id_servico: number;
  nome: string;
  descricao?: string;
  preco: number;
  ativo: boolean;
  criado_em?: string;
};

const API_URL = "https://precify-go-3tri.vercel.app/servicos";

function obterHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function verificarResposta(response: Response) {
  if (!response.ok) {
    const erro = await response.json().catch(() => null);

    if (response.status === 401) {
      throw new Error("Não autorizado. Faça login novamente.");
    }

    throw new Error(erro?.error || "Erro ao comunicar com a API");
  }

  return response;
}

export async function listarServicos(): Promise<Servico[]> {
  const response = await verificarResposta(
    await fetch(API_URL, {
      method: "GET",
      headers: obterHeaders(),
    })
  );

  return response.json();
}

export async function criarServico(
  servico: Omit<Servico, "id_servico" | "criado_em">
): Promise<Servico> {
  const response = await verificarResposta(
    await fetch(API_URL, {
      method: "POST",
      headers: obterHeaders(),
      body: JSON.stringify(servico),
    })
  );

  return response.json();
}

export async function atualizarServico(
  id: number,
  servico: Omit<Servico, "id_servico" | "criado_em">
): Promise<Servico> {
  const response = await verificarResposta(
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: obterHeaders(),
      body: JSON.stringify(servico),
    })
  );

  return response.json();
}

export async function excluirServico(id: number): Promise<void> {
  await verificarResposta(
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: obterHeaders(),
    })
  );
}
