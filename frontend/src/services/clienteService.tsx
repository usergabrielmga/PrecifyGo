export type ClientePayload = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf_cnpj: string;
};

const backend = 'https://precify-go-3tri.vercel.app';

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export function getClientesCache() {
  try {
    const cache = localStorage.getItem("clientes_cache");

    if (!cache) return null;

    const parsed = JSON.parse(cache);

    return parsed.data;
  } catch {
    localStorage.removeItem("clientes_cache");
    return null;
  }
}

export async function getClientes() {
  const response = await fetch(`${backend}/clientes`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar clientes");
  }

  const data = await response.json();

  const clientes = data.map((cliente: any) => ({
    id: cliente.id_cliente,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    endereco: cliente.endereco,
    cpf_cnpj: cliente.cpf_cnpj,
  }));

  localStorage.setItem(
    "clientes_cache",
    JSON.stringify({
      data: clientes,
      timestamp: Date.now(),
    })
  );

  return clientes;
}

export function clearClientesCache() {
  localStorage.removeItem("clientes_cache");
}

export async function createCliente(
  data: ClientePayload
): Promise<{ clienteId: number }> {

  const response = await fetch(`${backend}/clientes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}

export async function updateCliente(
  id: number,
  data: {
    nome: string;
    email: string;
    telefone: string;
    endereco: string;
    cpf_cnpj: string;
  }
) {
  const response = await fetch(`${backend}/clientes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText);
  }

  return response.json();
}

export async function deleteCliente(id: number) {
  const token = localStorage.getItem('token')

  const response = await fetch(
    `${backend}/clientes/${id}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  if (!response.ok) {
    const errorData = await response.json()

    throw new Error(
      errorData.error || 'Erro ao excluir cliente'
    )
  }

}