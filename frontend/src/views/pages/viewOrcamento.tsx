import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import OrcamentoCard from "../components/Orcamento.card";
import { useViewOrcamentos } from "../../hooks/useViewOrcamentos";

type StatusFiltro = "todos" | "Aprovado" | "Pendente" | "Recusado" | "Cancelado";

const FILTROS: { label: string; value: StatusFiltro }[] = [
  { label: "Todos", value: "todos" },
  { label: "Aprovado", value: "Aprovado" },
  { label: "Pendente", value: "Pendente" },
  { label: "Recusado", value: "Recusado" },
  { label: "Cancelado", value: "Cancelado" },
];

export default function ViewOrcamento() {
  const [filtroStatus, setFiltroStatus] = useState<StatusFiltro>("todos");
  const [busca, setBusca] = useState("");


const { orcamentos, loading } = useViewOrcamentos(undefined);
console.log("Orçamentos carregados:", orcamentos);

  const orcamentosFiltrados = orcamentos.filter((o) => {
    const matchStatus = filtroStatus === "todos" || o.status === filtroStatus;
    const matchBusca =
      o.cliente.toLowerCase().includes(busca.toLowerCase()) ||
      String(o.Numero_Orcamento).toLowerCase().includes(busca.toLowerCase());
    return matchStatus && matchBusca;
  });

  const contar = (s: string) => orcamentos.filter((o) => o.status === s).length;

  return (
    <main className="pt-10 px-4 sm:px-6 md:px-10 text-[#474646] rounded-2xl bg-[#F9F9F9] max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Orçamentos</h1>
          <p className="text-sm text-gray-500">Visualize e gerencie seus orçamentos</p>
        </div>
        <Link
          to="/orcamento"
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#EA2E52] text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:opacity-90 transition"
        >
          Novo orçamento <FaPlus />
        </Link>
      </div>

      {/* Busca + Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por cliente ou ID..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA2E52] focus:border-transparent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTROS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFiltroStatus(f.value)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                filtroStatus === f.value
                  ? "bg-[#EA2E52] text-white border-[#EA2E52]"
                  : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards de Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Aprovados", status: "Aprovado", color: "green" },
          { label: "Pendentes", status: "Pendente", color: "yellow" },
          { label: "Recusados", status: "Recusado", color: "red" },
          { label: "Cancelados", status: "Cancelado", color: "gray" },
        ].map(({ label, status, color }, i) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className={`bg-${color}-50 border border-${color}-200 rounded-xl p-4`}
          >
            <p className={`text-sm text-${color}-700 mb-1`}>{label}</p>
            <p className={`text-2xl font-semibold text-${color}-900`}>{contar(status)}</p>
          </motion.div>
        ))}
      </div>

      {/* Grid de Cards */}
      {loading ? (
        <p className="text-sm text-gray-500">Carregando orçamentos...</p>
      ) : orcamentosFiltrados.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-10">Nenhum orçamento encontrado.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orcamentosFiltrados.map((orcamento) => (
            <OrcamentoCard key={orcamento.id} orcamento={orcamento} />
          ))}
        </div>
      )}
    </main>
  );
}