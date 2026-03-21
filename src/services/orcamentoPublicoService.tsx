import type { OrcamentoPublico } from "../types/orcamentoPublico"


export async function getOrcamentoPublico(token: string): Promise<OrcamentoPublico> {
  const response = await fetch(`http://localhost:3000/orcamento/publico/${token}`)
  if (!response.ok) {
    throw new Error("Orçamento não encontrado")
  }
  return response.json()
}


export async function responderOrcamentoPublico(
  token: string,
  status: "Aprovado" | "Rejeitado" | "Cancelado"
) {
  const response = await fetch(
    `http://localhost:3000/orcamento/publico/${token}/responder`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    }
  )

  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Erro ao responder orçamento")

  return data
}
