
import { useEffect, useState } from "react";
import Card from "../components/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import {
  getDashboardCache,
  getDashboardData,
} from "../../services/dashboardService";
import {
  getOrcamentos,
  getOrcamentosCache,
} from "../../services/orcamentoService";
import { motion } from "framer-motion";

type DashboardData = {
  orcamentosMes: number;
  totalMes: number;
  orcamentosTotal: number;
  clientesTotal: number;
  status: {
    Pendente?: number;
    Aprovado?: number;
    Cancelado?: number;
    Rejeitado?: number;
  };
};

export default function Dashboard() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [ultimosOrcamentos, setUltimosOrcamentos] = useState<any[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const cache = getDashboardCache();

        if (cache) {
          setDashboard(cache);
        }

        const freshData = await getDashboardData();
        setDashboard(freshData);
      } catch (error) {
        console.error(error);
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const fetchUltimosOrcamentos = async () => {
      try {
        const cache = getOrcamentosCache();

        if (cache && Array.isArray(cache)) {
          setUltimosOrcamentos(cache.slice(0, 5));
        }

        const data = await getOrcamentos();

        if (Array.isArray(data)) {
          setUltimosOrcamentos(data.slice(0, 5));
        }
      } catch (error) {
        console.error("Erro ao carregar últimos orçamentos:", error);
      }
    };

    fetchUltimosOrcamentos();
  }, []);

  if (!dashboard) return <p>Carregando...</p>;

  const chartData = [
    {
      name: "Pendente",
      quantidade: dashboard.status?.Pendente ?? 0,
    },
    {
      name: "Aprovado",
      quantidade: dashboard.status?.Aprovado ?? 0,
    },
    {
      name: "Cancelado",
      quantidade: dashboard.status?.Cancelado ?? 0,
    },
    {
      name: "Rejeitado",
      quantidade: dashboard.status?.Rejeitado ?? 0,
    },
  ];

  const formatarValor = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(Number(valor));

  const statusClass = (status: string) => {
    const valor = status.toLowerCase();

    if (valor === "aprovado") {
      return "bg-green-100 text-green-700";
    }

    if (valor === "pendente") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (valor === "recusado") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-700";
  };

  const formatarStatus = (status: string) =>
    status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <div className="w-full max-w-[1250px] mx-auto min-w-0 p-4 md:p-6 lg:p-7 text-[#474646]">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-5">
        Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 lg:gap-4 mb-5 md:mb-6">
        <Card
          title="Orçamentos este mês"
          value={dashboard.orcamentosMes}
        />
        <Card
          title="Total este mês"
          value={`R$ ${dashboard.totalMes}`}
        />
        <Card
          title="Total de Orçamentos"
          value={dashboard.orcamentosTotal}
        />
        <Card
          title="Clientes"
          value={dashboard.clientesTotal}
        />
      </div>

      {/* GRÁFICOS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-5 md:mb-6">
        {/* BAR CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-w-0 bg-white rounded-xl p-4 lg:p-5 border border-gray-200"
        >
          <h3 className="text-base md:text-lg font-semibold mb-4">
            Distribuição por Status
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis width={60} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar
                dataKey="quantidade"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                barSize={38}
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* LINE CHART */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="min-w-0 bg-white rounded-xl p-4 lg:p-5 border border-gray-200"
        >
          <h3 className="text-base md:text-lg font-semibold mb-4">
            Tendência por Status
          </h3>

          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis width={30} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="quantidade"
                stroke="#EA2E52"
                strokeWidth={2.5}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* ÚLTIMOS ORÇAMENTOS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full min-w-0 bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="p-4 md:p-5 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            Orçamentos Recentes
          </h3>
        </div>

        {/* TABELA DESKTOP */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  ID
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Cliente
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Valor
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-600">
                  Status
                </th>
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
                  <td className="px-4 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                    #ORC-{quote.numero_orcamento}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-700 break-words">
                    {quote.cliente}
                  </td>

                  <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                    {formatarValor(quote.total)}
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass(
                        quote.status
                      )}`}
                    >
                      {formatarStatus(quote.status)}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CARDS MOBILE */}
        <div className="sm:hidden divide-y divide-gray-100">
          {ultimosOrcamentos.map((quote) => (
            <div key={quote.id} className="p-4 space-y-2">
              <div className="flex justify-between items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">
                  #ORC-{quote.numero_orcamento}
                </span>

                <span
                  className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusClass(
                    quote.status
                  )}`}
                >
                  {formatarStatus(quote.status)}
                </span>
              </div>

              <p className="text-sm font-medium text-gray-800 break-words">
                {quote.cliente}
              </p>

              <p className="text-sm text-gray-600">
                {formatarValor(quote.total)}
              </p>
            </div>
          ))}
        </div>

        {ultimosOrcamentos.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-6">
            Nenhum orçamento encontrado.
          </p>
        )}
      </motion.div>
    </div>
  );
}
