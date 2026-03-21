import { useState } from "react";
import { getOrcamentoPdf } from "../services/orcamentoService";
import { responderOrcamentoPublico } from "../services/orcamentoPublicoService";
import { useNotification } from "../context/useNotification";
import type { Orcamento } from "../types/orcamento";

export function useOrcamentoCard(orcamento: Orcamento) {
  const [menuAberto, setMenuAberto] = useState(false);
  const { showNotification } = useNotification();

  const downloadPDF = async () => {
    try {
      const blob = await getOrcamentoPdf(orcamento.Numero_Orcamento);
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `orcamento-${orcamento.Numero_Orcamento}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    } catch {
      showNotification("Erro ao gerar PDF");
    }
  };

  const compartilhar = async () => {
    if (!orcamento.token_publico) {
      showNotification("Link inválido");
      return;
    }

    try {
      const link = `${window.location.origin}/orcamento-publico/${orcamento.token_publico}`;
      await navigator.clipboard.writeText(link);

      showNotification("📎 Link copiado!");
    } catch {
      showNotification("Erro ao copiar link");
    }

    setMenuAberto(false);
  };

  const cancelar = async () => {
    if (!orcamento.token_publico) {
      showNotification("Token inválido");
      return;
    }

    try {
      await responderOrcamentoPublico(orcamento.token_publico, "Cancelado");
      showNotification("⛔ Orçamento cancelado.");
    } catch (err) {
      showNotification((err as Error).message);
    }
  };

  return {
    menuAberto,
    setMenuAberto,
    downloadPDF,
    compartilhar,
    cancelar,
  };
}