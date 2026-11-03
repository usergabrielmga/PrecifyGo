
import { useState } from "react";
import type { Servico } from "../services/servicoService";

type ServicoModalProps = {
  open: boolean;
  servicos: Servico[];
  onClose: () => void;
  onSelect: (servico: Servico) => void;
};

export default function ServicoModal({
  open,
  servicos,
  onClose,
  onSelect,
}: ServicoModalProps) {
  const [busca, setBusca] = useState("");

  if (!open) {
    return null;
  }

  const servicosFiltrados = servicos.filter((servico) =>
    servico.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-5 border-b">
          <div>
            <h2 className="font-semibold text-xl">
              Selecionar Serviço
            </h2>

            <p className="text-sm text-gray-500">
              Escolha um serviço para adicionar ao orçamento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Busca */}
        <div className="p-4">
          <input
            type="text"
            autoFocus
            placeholder="🔍 Pesquisar serviço..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Serviços */}
        <div className="overflow-y-auto px-4 pb-4">
          {servicosFiltrados.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Nenhum serviço encontrado.
            </div>
          )}

          {servicosFiltrados.map((servico) => (
            <button
              key={servico.id_servico}
              type="button"
              onClick={() => onSelect(servico)}
              className="w-full text-left border border-gray-200 rounded-lg p-4 mb-3 hover:border-green-500 hover:bg-green-50 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{servico.nome}</p>

                  {servico.descricao && (
                    <p className="text-sm text-gray-500 mt-1">
                      {servico.descricao}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    R$ {Number(servico.preco).toFixed(2)}
                  </p>

                  <p className="text-sm text-green-600 mt-1">
                    Selecionar
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Rodapé */}
        <div className="border-t p-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-400 rounded px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
