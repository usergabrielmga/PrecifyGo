import { useEffect, useState } from "react"
import Card from "../components/card"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js"
import { Bar } from "react-chartjs-2"
import { getDashboardData } from "../../services/dashboardService"
import { getOrcamentos } from "../../services/orcamentoService"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend
)

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<any>(null)
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
      setUltimosOrcamentos(data.slice(0, 5)) 
    } catch (error) {
      console.error("Erro ao carregar últimos orçamentos:", error)
    }
  }

  fetchUltimosOrcamentos()
}, [])


  if (!dashboard) return <p>Carregando...</p>

  const chartData = {
    labels: ["Pendentes", "Aprovados", "Cancelados", "Rejeitados"],
    datasets: [
      {
        label: "Quantidade",
        data: [
          dashboard.status.Pendente || 0,
          dashboard.status.Aprovado || 0,
          dashboard.status.Cancelado || 0,
          dashboard.status.Rejeitado || 0
        ],
        backgroundColor: [
          "#f6ce35",
          "#22c55e",
          "#f97316",
          "#ef4444"
        ],
        borderRadius: 8
      }
    ]
  }

  return (
    <div className="p-6 max-w-7xl mx-auto rounded-2xl bg-[#F9F9F9]">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      
      <div className="grid grid-cols-2 gap-6 mb-10">
        <Card title="Orçamentos este mês" value={dashboard.orcamentosMes} />
        <Card title="Total este mês" value={`R$ ${dashboard.totalMes}`} />
        <Card title="Total de Orçamentos" value={dashboard.orcamentosTotal} />
        <Card title="Clientes" value={dashboard.clientesTotal} />
      </div>

      
      <h2 className="text-2xl font-semibold mb-4">
        Status dos Orçamentos
      </h2>

      <div className="grid grid-cols-2 gap-6 mb-10">
        <Card title="Pendentes" value={dashboard.status.Pendente || 0} />
        <Card title="Aprovados" value={dashboard.status.Aprovado || 0} />
        <Card title="Cancelados" value={dashboard.status.Cancelado || 0} />
        <Card title="Rejeitados" value={dashboard.status.Rejeitado || 0} />
      </div>

      
      <h2 className="text-2xl font-semibold mb-4">
        Visão geral
      </h2>

      <div className="grid grid-cols-2 gap-6">

        
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">
            Gráfico de Status dos Orçamentos
          </h3>

          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>

        
        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <h3 className="text-xl font-semibold mb-4">
            Últimos Orçamentos
          </h3>

          <ul className="space-y-4">
            {ultimosOrcamentos.map((orc: any, index: number) => (
              <li
                 key={orc.id ?? `orc-${index}`}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <p className="font-medium">
                    {orc.cliente}
                  </p>
                  <p className="text-sm text-gray-500">
                    #{orc.Numero_Orcamento}
                  </p>
                </div>

                <div className="text-right">
                  

                  <span
                    className={`text-xs px-2 py-1 rounded-full
                      ${
                        orc.status === "Aprovado"
                          ? "bg-green-100 text-green-700"
                          : orc.status === "Pendente"
                          ? "bg-yellow-100 text-yellow-700"
                          : orc.status === "Cancelado"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-red-100 text-red-700"
                      }
                    `}
                  >
                    {orc.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  )
}
