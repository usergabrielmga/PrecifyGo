import {
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Calendar,
  Loader2,
} from "lucide-react";
import { useOrcamentoPublico } from "../../hooks/useOrcamentoPublico";
import { motion } from "framer-motion";

const API_URL = "http://localhost:3000";

export default function OrcamentoPublico() {
  const { orcamento, loading, mensagem, responder } =
    useOrcamentoPublico();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-2xl shadow-lg text-center"
        >
          <Loader2 className="w-12 h-12 text-[#EA2E52] animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600">
            Carregando orçamento...
          </p>
        </motion.div>
      </div>
    );
  }

  if (mensagem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-[#FEF2F4] rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-[#EA2E52]" />
          </div>

          <p className="text-xl font-semibold text-gray-900">
            {mensagem}
          </p>
        </motion.div>
      </div>
    );
  }

  if (!orcamento) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full"
        >
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>

          <p className="text-xl font-semibold text-gray-900">
            Orçamento não encontrado
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6"
        >
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-[#FEF2F4] rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-[#EA2E52]" />
                </div>

                <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
                  Orçamento #{orcamento.numero_orcamento}
                </h1>
              </div>

              <div className="flex items-center gap-2 text-gray-600 ml-[60px]">
                <Calendar className="w-4 h-4" />

                <p className="text-sm">
                  Validade: {orcamento.validade}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {orcamento.status === "Pendente" && (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                  Aguardando Resposta
                </span>
              )}

              {orcamento.status === "Aprovado" && (
                <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Aprovado
                </span>
              )}

              {orcamento.status === "Rejeitado" && (
                <span className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Recusado
                </span>
              )}
            </div>
          </div>
        </motion.div>

        {/* PDF - SEM MOTION */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50">
            <h3 className="font-medium text-gray-900">
              Visualização do Orçamento
            </h3>
          </div>

          <div className="p-4 bg-gray-100">
            <iframe
              src={`${API_URL}/orcamentos/${orcamento.numero_orcamento}/view-pdf`}
              className="w-full h-[650px] rounded-lg bg-white"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <a
              href={`${API_URL}/orcamentos/${orcamento.numero_orcamento}/pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              <Download className="w-5 h-5" />
              Baixar PDF
            </a>

            {orcamento.status === "Pendente" ? (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => responder("Rejeitado")}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-red-500 text-red-600 font-medium hover:bg-red-50 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Recusar
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => responder("Aprovado")}
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[#EA2E52] text-white font-medium hover:bg-[#d12847] transition-colors shadow-lg shadow-[#EA2E52]/30"
                >
                  <CheckCircle className="w-5 h-5" />
                  Aceitar Orçamento
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-gray-600">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>

                <p className="font-medium">
                  Este orçamento já foi respondido
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}