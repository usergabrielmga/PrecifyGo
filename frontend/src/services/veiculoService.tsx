import type { Veiculo, VeiculoPayload } from "../types/veiculo";

const backend = "https://precify-go-3tri.vercel.app";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function tratarResposta(response: Response) {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || "Erro ao processar veículo");
  }

  if (response.status === 204) return null;

  return response.json();
}

export async function getVeiculos(
  clienteId?: number,
  signal?: AbortSignal
): Promise<Veiculo[]> {
  const params = clienteId ? `?clienteId=${clienteId}` : "";

  const response = await fetch(`${backend}/veiculos${params}`, {
    headers: getAuthHeaders(),
    signal,
  });

  return tratarResposta(response);
}

export async function createVeiculo(
  data: VeiculoPayload
): Promise<Veiculo> {
  const response = await fetch(`${backend}/veiculos`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return tratarResposta(response);
}

export async function updateVeiculo(
  id: number,
  data: VeiculoPayload
): Promise<Veiculo> {
  const response = await fetch(`${backend}/veiculos/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return tratarResposta(response);
}

export async function deleteVeiculo(id: number) {
  const response = await fetch(`${backend}/veiculos/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return tratarResposta(response);
}