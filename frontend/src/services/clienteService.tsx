export type ClientePayload = {
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf_cnpj: string;
};

const backend = import.meta.env.VITE_BACKEND_URL;

export async function getClientes() {
  const response = await fetch(`${backend}/clientes`);

  if (!response.ok) {
    throw new Error("Erro ao buscar clientes");
  }

  const data = await response.json();

  return data.map((cliente: any) => ({
    id: cliente.Id_cliente, 
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
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return response.json()
}

export async function updateCliente(
  id: number,
  data: { nome: string; email: string; telefone: string; endereco: string; cpf_cnpj: string }
) {
  const response = await fetch(`${backend}/clientes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText)
  }

  return response.json()
}



export async function deleteCliente(id: number) {
  const response = await fetch(`${backend}/clientes/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro backend:", errorText);
    throw new Error("Erro ao excluir cliente");
  }

}
