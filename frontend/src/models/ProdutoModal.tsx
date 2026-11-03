
import { useState } from "react";
import type { Produto } from "../services/produtoService";

type ProdutoModalProps = {
  open: boolean;
  produtos: Produto[];
  onClose: () => void;
  onSelect: (produto: Produto) => void;
};

export default function ProdutoModal({
  open,
  produtos,
  onClose,
  onSelect,
}: ProdutoModalProps) {
  const [busca, setBusca] = useState("");

  if (!open) {
    return null;
  }

  const produtosFiltrados = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
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
              Selecionar Produto
            </h2>

            <p className="text-sm text-gray-500">
              Escolha um produto para adicionar ao orçamento.
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
            placeholder="🔍 Pesquisar produto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Produtos */}
        <div className="overflow-y-auto px-4 pb-4">
          {produtosFiltrados.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Nenhum produto encontrado.
            </div>
          )}

          {produtosFiltrados.map((produto) => (
            <button
              key={produto.id_produto}
              type="button"
              disabled={produto.estoque <= 0}
              onClick={() => onSelect(produto)}
              className="w-full text-left border border-gray-200 rounded-lg p-4 mb-3 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">{produto.nome}</p>

                  {produto.descricao && (
                    <p className="text-sm text-gray-500 mt-1">
                      {produto.descricao}
                    </p>
                  )}

                  <p className="text-sm text-gray-500 mt-1">
                    Estoque: {produto.estoque}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold">
                    R$ {Number(produto.preco).toFixed(2)}
                  </p>

                  <p className="text-sm text-blue-600 mt-1">
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
