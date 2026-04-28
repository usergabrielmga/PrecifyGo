import { X } from "lucide-react";
import { getOrcamentoPdf } from "../services/orcamentoService";

type Props = {
  open: boolean;
  orcamentoId?: number;
  onClose: () => void;
};

export function PdfSuccessModal({ open, orcamentoId, onClose }: Props) {
  if (!open) return null;

  async function handleDownload() {
    if (!orcamentoId) return;

    try {
      const blob = await getOrcamentoPdf(orcamentoId);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `orcamento-${orcamentoId}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      alert("Erro ao baixar PDF");
    }
  }

  function handleViewBudgets() {
    window.location.href = "/orcamentos";
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="relative bg-white rounded-xl w-[520px] p-8 shadow-2xl">

        {/* Botão fechar (X) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {/* Conteúdo */}
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
            <span className="text-green-600 text-3xl">✓</span>
          </div>

          <h2 className="text-2xl font-bold mb-2">
            Orçamento gerado com sucesso
          </h2>

          <p className="text-gray-600 mb-8">
            Seu orçamento foi criado e o PDF já está disponível para download
            ou visualização.
          </p>

          <div className="flex gap-4 w-full">
            <button
              onClick={handleViewBudgets}
              className="flex-1 border border-gray-300 rounded-lg py-3 font-medium hover:bg-gray-100 transition"
            >
              Ver meus orçamentos
            </button>

            <button
              onClick={handleDownload}
              className="flex-1 bg-[#EA2E52] text-white rounded-lg py-3 font-semibold hover:opacity-90 transition"
            >
              Baixar PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
