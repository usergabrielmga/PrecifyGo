import { useEffect, useState } from "react"
import Card from "../components/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { getDashboardData } from "../../services/dashboardService"
import { getOrcamentos } from "../../services/orcamentoService"
import { motion } from "framer-motion"


type DashboardData = {
  orcamentosMes: number
  totalMes: number
  orcamentosTotal: number
  clientesTotal: number
  status: {
    Pendente?: number
    Aprovado?: number
    Cancelado?: number
    Rejeitado?: number
  }
}

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [ultimosOrcamentos, setUltimosOrcamentos] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getDashboardData()
        setDashboard(response)
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const fetchUltimosOrcamentos = async () => {
      try {
        const data = await getOrcamentos()
        console.log("Orçamentos recebidos:", data)
  
        if (Array.isArray(data)) {
          setUltimosOrcamentos(data.slice(0, 5))
        }
      } catch (error) {
        console.error("Erro ao carregar últimos orçamentos:", error)
      }
    }

    fetchUltimosOrcamentos()
  }, [])

  if (!dashboard) return <p>Carregando...</p>


  const chartData = [
    {
      name: "Pendente",
      quantidade: dashboard.status?.Pendente ?? 0
    },
    {
      name: "Aprovado",
      quantidade: dashboard.status?.Aprovado ?? 0
    },
    {
      name: "Cancelado",
      quantidade: dashboard.status?.Cancelado ?? 0
    },
    {
      name: "Rejeitado",
      quantidade: dashboard.status?.Rejeitado ?? 0
    }
  ]

  return (
    <div className="p-3 md:p-5 max-w-7xl mx-auto rounded-2xl bg-[#F9F9F9] ">
      <h1 className="text-xl md:text-2xl font-bold mb-3 md:mb-5">
        Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
        <Card title="Orçamentos este mês" value={dashboard.orcamentosMes} />
        <Card title="Total este mês" value={`R$ ${dashboard.totalMes}`} />
        <Card title="Total de Orçamentos" value={dashboard.orcamentosTotal} />
        <Card title="Clientes" value={dashboard.clientesTotal} />
      </div>


      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

        {/* BAR CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-6">
            Distribuição por Status
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="quantidade"
                fill="#10b981"
                radius={[8, 8, 0, 0]}
                barSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* LINE CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200"
        >
          <h3 className="text-lg font-semibold mb-6">
            Tendência por Status
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="quantidade"
                stroke="#EA2E52"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ÚLTIMOS ORÇAMENTOS */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-xl border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Orçamentos Recentes</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Cliente</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Valor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {ultimosOrcamentos.map((quote) => (
                  <motion.tr
                    key={quote.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">#ORC-{quote.Numero_Orcamento}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{quote.cliente}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(Number(quote.total))}
                    </td>
                    <td className="px-6 py-4">
                     <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          quote.status.toLowerCase() === "aprovado"
                            ? "bg-green-100 text-green-700"
                            : quote.status.toLowerCase() === "pendente"
                            ? "bg-yellow-100 text-yellow-700"
                            : quote.status.toLowerCase() === "recusado"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {quote.status.charAt(0).toUpperCase() + quote.status.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
    </div>
  )
}