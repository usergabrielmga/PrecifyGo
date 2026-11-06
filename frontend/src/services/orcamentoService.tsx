import type { OrcamentoFormData } from "../schemas/orcamento.schema";

const backend = 'https://precify-go-3tri.vercel.app';

export async function createOrcamento(data: OrcamentoFormData) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${backend}/orcamentos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro backend:", errorText);
    throw new Error("Erro ao criar orçamento");
  }

  return response.json();
}


export function getOrcamentosCache() {
  try {
    const cache = localStorage.getItem("orcamentos_cache");

    if (!cache) return null;

    const parsed = JSON.parse(cache);

    return parsed.data;
  } catch {
    localStorage.removeItem("orcamentos_cache");
    return null;
  }
}

export async function getOrcamentos() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${backend}/orcamentos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro backend:", errorText);
    throw new Error("Erro ao buscar orçamentos");
  }

  const data = await response.json();

  localStorage.setItem(
    "orcamentos_cache",
    JSON.stringify({
      data,
      timestamp: Date.now(),
    })
  );

  return data;
}

export async function getOrcamentoPdf(id: number) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${backend}/orcamentos/${id}/pdf`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error("Erro ao gerar PDF");
  }

  return await response.blob();
}


