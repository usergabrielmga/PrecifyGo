import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getOrcamentoPublico, responderOrcamentoPublico } from "../services/orcamentoPublicoService"
import type { OrcamentoPublico } from "../types/orcamentoPublico"



export function useOrcamentoPublico() {
  const { token } = useParams<{ token?: string }>()

  const [orcamento, setOrcamento] = useState<OrcamentoPublico | null>(null)
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo({ top: 0 })

    async function fetchOrcamento() {
      if (!token) {
        setMensagem("Token inválido")
        setLoading(false)
        return
      }

      try {
        const data = await getOrcamentoPublico(token)
        setOrcamento(data)
      } catch {
        setMensagem("Orçamento inválido ou não encontrado")
      } finally {
        setLoading(false)
      }
    }

    fetchOrcamento()
  }, [token])

  const responder = async (status: "Aprovado" | "Rejeitado") => {
    if (!token) {
      setMensagem("Token inválido")
      return
    }

    try {
      await responderOrcamentoPublico(token, status)

      setMensagem(
        status === "Aprovado"
          ? "✅ Orçamento aprovado com sucesso!"
          : "❌ Orçamento recusado."
      )

      setOrcamento((prev) =>
        prev ? { ...prev, status } : prev
      )
    } catch (err: any) {
      setMensagem(err.message)
    }
  }

  return {
    orcamento,
    loading,
    mensagem,
    responder
  }
}