import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getOrcamentoPublico, responderOrcamentoPublico } from "../../services/orcamentoPublicoService"

export default function OrcamentoPublico() {
  const { token } = useParams()
  const [orcamento, setOrcamento] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mensagem, setMensagem] = useState<string | null>(null)

  useEffect(() => {
  window.scrollTo({ top: 0 })

  const fetchOrcamento = async () => {
    if (!token) {
      setMensagem("Token inválido")
      setLoading(false)
      return
    }

    try {
      const data = await getOrcamentoPublico(token)
      setOrcamento(data)
    } catch (err: any) {
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

    // opcional: atualizar status local
    setOrcamento((prev: any) => prev ? { ...prev, status } : prev)
  } catch (err: any) {
    setMensagem(err.message)
  }
}

  if (loading) {
    return <p className="p-6 text-center">Carregando orçamento...</p>
  }

  if (mensagem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow text-center max-w-md">
          <p className="text-xl font-semibold">{mensagem}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="bg-white w-full max-w-5xl rounded-2xl shadow p-6">

        
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Orçamento #{orcamento.Numero_Orcamento}
          </h1>

          <p className="text-gray-600 mt-1">
            Validade: {orcamento.validade}
          </p>
        </div>

        
        <div className="border rounded-xl overflow-hidden bg-gray-100 mb-6">
            <embed
                src={`http://localhost:3000/orcamentos/${orcamento.Numero_Orcamento}/view-pdf`}
                type="application/pdf"
                className="w-full h-[650px]"
        />
        </div>


        
        <div className="flex justify-end mb-8">
          <a
            href={`http://localhost:3000/orcamentos/${orcamento.Numero_Orcamento}/pdf`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            ⬇️ Baixar PDF
          </a>
        </div>

        
        {orcamento.status === "Pendente" ? (
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => responder("Rejeitado")}
              className="px-6 py-3 rounded-xl border border-red-500 text-red-600 hover:bg-red-50 transition"
            >
              Recusar
            </button>

            <button
              onClick={() => responder("Aprovado")}
              className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
            >
              Aceitar Orçamento
            </button>
          </div>
        ) : (
          <p className="text-center text-lg font-semibold mt-6">
            Este orçamento já foi respondido.
          </p>
        )}
      </div>
    </div>
  )
}
