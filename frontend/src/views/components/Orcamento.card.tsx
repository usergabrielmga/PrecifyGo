
import {
  UserRound,
  CalendarDays,
  CalendarCheck,
  Wallet,
  MoreVertical,
  Share2,
  FileDown,
  Ban,
} from "lucide-react";

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

  const statusClass =
    orcamento.status === "Pendente"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : orcamento.status === "Aprovado"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : orcamento.status === "Cancelado"
      ? "bg-gray-100 text-gray-600 border-gray-200"
      : "bg-red-50 text-red-700 border-red-200";

  return (
    <div className="relative bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
      {/* CABEÇALHO */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
            #{orcamento.numero_orcamento}
          </span>

          <span
            className={`text-[11px] font-medium px-2.5 py-1 rounded-md border whitespace-nowrap ${statusClass}`}
          >
            {orcamento.status}
          </span>
        </div>

        {/* MENU */}
        <button
          type="button"
          onClick={() => setMenuAberto(!menuAberto)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition shrink-0"
          aria-label="Abrir opções do orçamento"
        >
          <MoreVertical size={19} />
        </button>
      </div>

      {/* MENU DE AÇÕES */}
      {menuAberto && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setMenuAberto(false)}
          />

          <div className="absolute right-4 top-12 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20">
            <button
              onClick={compartilhar}
              className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <Share2 size={16} />
              Compartilhar
            </button>

            <button
              onClick={downloadPDF}
              className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <FileDown size={16} />
              Baixar PDF
            </button>

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={cancelar}
              className="w-full flex items-center gap-2.5 text-left px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
            >
              <Ban size={16} />
              Cancelar orçamento
            </button>
          </div>
        </>
      )}

      {/* CLIENTE */}
      <div className="flex items-start gap-3 mb-4 min-w-0">
        <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
          <UserRound size={18} className="text-gray-500" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] text-gray-500 mb-0.5">
            Cliente
          </p>

          <p className="text-sm font-semibold text-gray-800 break-words">
            {orcamento.cliente}
          </p>
        </div>
      </div>

      {/* DATAS */}
      <div className="grid grid-cols-2 gap-3 border-t border-gray-100 pt-3">
        <div className="flex items-start gap-2 min-w-0">
          <CalendarDays
            size={16}
            className="text-gray-400 mt-0.5 shrink-0"
          />

          <div className="min-w-0">
            <p className="text-[11px] text-gray-500">
              Emissão
            </p>

            <p className="text-xs font-medium text-gray-700 break-words">
              {orcamento.data_emissao?.split("T")[0]?.split(" ")[0]}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-2 min-w-0">
          <CalendarCheck
            size={16}
            className="text-gray-400 mt-0.5 shrink-0"
          />

          <div className="min-w-0">
            <p className="text-[11px] text-gray-500">
              Validade
            </p>

            <p className="text-xs font-medium text-gray-700 break-words">
              {orcamento.validade?.split("T")[0]?.split(" ")[0]}
            </p>
          </div>
        </div>
      </div>

      {/* VALOR */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wallet size={17} className="text-[#EA2E52]" />

          <span className="text-xs font-medium text-gray-500">
            Valor total
          </span>
        </div>

        <span className="text-base font-bold text-gray-900 whitespace-nowrap">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(Number(orcamento.total))}
        </span>
      </div>
    </div>
  );
}

export default OrcamentoCard;
