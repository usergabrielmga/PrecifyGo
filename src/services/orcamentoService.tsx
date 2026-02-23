import type { OrcamentoFormData } from "../schemas/orcamento.schema";

export async function createOrcamento(data: OrcamentoFormData) {
  console.log("Dados enviados para o backend:", JSON.stringify(data, null, 2));
  const response = await fetch("http://localhost:3000/orcamentos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
  const response = await fetch("http://localhost:3000/orcamentos", {
    method: "GET",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Erro backend:", errorText);
    throw new Error("Erro ao buscar orçamentos");
  }

  return response.json();
}


export async function getOrcamentoPdf(id: number) {
  const response = await fetch(
    `http://localhost:3000/orcamentos/${id}/pdf`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    throw new Error("Erro ao gerar PDF");
  }

  const blob = await response.blob();
  return blob;
}
