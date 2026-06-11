export type ClientePayload = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf_cnpj: string;
};

const backend = 'http://localhost:3000';

function getAuthHeaders() {
  const token = localStorage.getItem('token');

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function getClientes() {
  const response = await fetch(`${backend}/clientes`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Erro ao buscar clientes");
  }

  const data = await response.json();

  return data.map((cliente: any) => ({
    id: cliente.id_cliente,
    nome: cliente.nome,
    email: cliente.email,
    telefone: cliente.telefone,
    endereco: cliente.endereco,
    cpf_cnpj: cliente.cpf_cnpj,
  }));
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