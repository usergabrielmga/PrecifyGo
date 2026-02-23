import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";

import Person from "../../assets/Person.png";
import Calendar from "../../assets/Calendar.png";
import Cash from "../../assets/Cash.png";
import MenuVertical from "../../assets/Menu Vertical.png";
import TearCalendar from "../../assets/Tear-Off Calendar.png";
import { Link, useParams } from "react-router-dom";

import { getOrcamentos } from "../../services/orcamentoService";


type Orcamento = {
  token_publico: any;
  id: number;
  status: string;
  cliente: string;
  data_emissao: string;
  validade: string;
  total: number;
};

function OrcamentoCard({ orcamento }: { orcamento: Orcamento }) {

  const [menuAberto, setMenuAberto] = useState(false);


  const compartilhar = async () => {
    console.log("Token:", orcamento.token_publico);

    if (!orcamento.token_publico) return;

    const link = `${window.location.origin}/orcamento-publico/${orcamento.token_publico}`;

    try {
      await navigator.clipboard.writeText(link);
      console.log("Link copiado:", link);
    } catch (error) {
      console.error("Erro ao copiar link:", error);
    }

    setMenuAberto(false);
  };


  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      
      {/* TOPO */}
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            #{orcamento.id}
          </span>

          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full
              ${
                orcamento.status === "Pendente"
                  ? "bg-yellow-100 text-yellow-700"
                  : orcamento.status === "Aprovado"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }
            `}
          >
            {orcamento.status}
          </span>
        </div>

        <img
          src={MenuVertical}
          alt="Menu"
          className="w-4 h-4 cursor-pointer"
          onClick={() => setMenuAberto(!menuAberto)}
        />
      </div>
      {menuAberto && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-md z-10">
              <button
                onClick={compartilhar}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                🔗 Compartilhar
              </button>
            </div>
      )}

      {/* CONTEÚDO */}
      <div className="flex flex-col gap-2 text-xs text-gray-700">
        <div className="flex items-center gap-2">
          <img src={Person} className="w-4 h-4" />
          <span>
            <strong>Cliente:</strong> {orcamento.cliente}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <img src={Calendar} className="w-4 h-4" />
          <span>
            <strong>Data:</strong> {orcamento.data_emissao}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <img src={TearCalendar} className="w-4 h-4" />
          <span>
            <strong>Validade:</strong> {orcamento.validade}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <img src={Cash} className="w-4 h-4" />
          <span className="font-semibold text-sm text-gray-900">
            R$ {Number(orcamento.total).toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ViewOrcamento() {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);
  const { status } = useParams();

  useEffect(() => {
  async function fetchOrcamentos() {
    try {
      const data = await getOrcamentos();

      const filtrados = status
        ? data.filter((o: { status: string; }) =>
            o.status.toLowerCase() === status.toLowerCase()
          )
        : data;

        console.log("Orçamentos filtrados:", filtrados);

      setOrcamentos(filtrados);
    } catch (error) {
      console.error("Erro ao buscar orçamentos", error);
    } finally {
      setLoading(false);
    }
  }

  fetchOrcamentos();
}, [status]);

  return (
    <main className="pt-10 px-10 text-[#474646] rounded-2xl bg-[#F9F9F9] max-w-7xl mx-auto">
      
  
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-sm text-gray-500">
            Visualize e gerencie seus orçamentos
          </p>
        </div>

        <Link to="/orcamento" className="flex items-center gap-2 bg-[#EA2E52] text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          Novo orçamento <FaPlus />
        </Link>
      </div>

      {/* GRID */}
      {loading ? (
        <p className="text-sm text-gray-500">Carregando orçamentos...</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {orcamentos.map((orcamento, key) => (
            <OrcamentoCard
              key={key}
              orcamento={orcamento}
            />
          ))}
        </div>
      )}
    </main>
  );
}
