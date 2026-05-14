import type { OrcamentoFormData } from "../schemas/orcamento.schema";

const backend = 'http://localhost:3000';

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


export async function getOrcamentos() {
  const token = localStorage.getItem("token");

  const response = await fetch(`${backend}/orcamentos`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro backend:", errorText);
    throw new Error("Erro ao buscar orçamentos");
  }

  return response.json();
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