
import { FaPlus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import OrcamentoCard from "../components/Orcamento.card";
import { useViewOrcamentos } from "../../hooks/useViewOrcamentos";

export default function ViewOrcamento() {
   const { status } = useParams();

  const { orcamentos, loading } = useViewOrcamentos(status);

  return (
    <main className="pt-10 px-4 sm:px-6 md:px-10 text-[#474646] rounded-2xl bg-[#F9F9F9] max-w-7xl mx-auto">
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">

    {/* TEXTO */}
    <div>
      <h1 className="text-xl sm:text-2xl font-bold">Orçamentos</h1>
      <p className="text-sm text-gray-500">
        Visualize e gerencie seus orçamentos
      </p>
    </div>

    {/* BOTÃO */}
    <Link
      to="/orcamento"
      className="
        flex items-center justify-center gap-2
        w-full sm:w-auto
        bg-[#EA2E52] text-white
        px-4 py-2
        text-sm sm:text-base
        rounded-lg
        hover:opacity-90 transition
      "
    >
      Novo orçamento <FaPlus />
    </Link>

  </div>

      {loading ? (
        <p className="text-sm text-gray-500">Carregando orçamentos...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orcamentos.map((orcamento) => (
            <OrcamentoCard
              key={orcamento.id}
              orcamento={orcamento}
            />
          ))}
        </div>
      )}
    </main>
  );
}