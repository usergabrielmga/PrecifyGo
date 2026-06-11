export interface OrcamentoPublico {
  numero_orcamento: string | number
  cliente: string
  status: "Pendente" | "Aprovado" | "Rejeitado" | "Cancelado"

  validade: string
  forma_pagamento: string
  data_emissao: string
  observacoes?: string | null

  itens: Array<{
    produto_servico: string
    quantidade: number
    valor_unitario: number
    total_item: number
  }>

  total: number
}