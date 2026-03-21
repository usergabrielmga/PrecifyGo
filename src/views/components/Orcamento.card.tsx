import Person from "../../assets/Person.png";
import Calendar from "../../assets/Calendar.png";
import Cash from "../../assets/Cash.png";
import MenuVertical from "../../assets/Menu Vertical.png";
import TearCalendar from "../../assets/Tear-Off Calendar.png";
import type { Orcamento } from "../../types/orcamento";
import { useOrcamentoCard } from "../../hooks/useOrcamentoCard";

function OrcamentoCard({ orcamento }: { orcamento: Orcamento }) {
  const {
    menuAberto,
    setMenuAberto,
    downloadPDF,
    compartilhar,
    cancelar,
  } = useOrcamentoCard(orcamento);

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      
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
                  : orcamento.status === "Cancelado"
                  ? "bg-[#A9A9A9] text-[#302f2f]"
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
        <div className="absolute right-0 mt-2 w-50 bg-white border rounded-lg shadow-md z-10">
          <button
            onClick={compartilhar}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Compartilhar
          </button>

          <button
            onClick={downloadPDF}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Baixar PDF
          </button>

          <button
            onClick={cancelar}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Cancelar orçamento
          </button>
        </div>
      )}

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

export default OrcamentoCard;