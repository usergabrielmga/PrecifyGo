import { useState } from "react";

export type Cliente = {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  cpf_cnpj: string;
};

type ClienteSelectedModalProps = {
  open: boolean;
  clientes: Cliente[];
  onClose: () => void;
  onSelect: (cliente: Cliente) => void;
};

export default function ClienteSelectedModal({
  open,
  clientes,
  onClose,
  onSelect,
}: ClienteSelectedModalProps) {
  const [busca, setBusca] = useState("");

  if (!open) {
    return null;
  }

  const clientesFiltrados = clientes.filter((cliente) =>
    [
      cliente.nome,
      cliente.cpf_cnpj,
      cliente.email,
      cliente.telefone,
    ].some((campo) =>
      campo?.toLowerCase().includes(busca.toLowerCase())
    )
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
              Selecionar Cliente
            </h2>

            <p className="text-sm text-gray-500">
              Escolha um cliente para adicionar ao orçamento.
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
            placeholder="🔍 Pesquisar cliente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
          />
        </div>

        {/* Clientes */}
        <div className="overflow-y-auto px-4 pb-4">
          {clientesFiltrados.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              Nenhum cliente encontrado.
            </div>
          )}

          {clientesFiltrados.map((cliente) => (
            <button
              key={cliente.id}
              type="button"
              onClick={() => {
                onSelect(cliente);
                setBusca("");
              }}
              className="w-full text-left border border-gray-200 rounded-lg p-4 mb-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {cliente.nome}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    CPF/CNPJ: {cliente.cpf_cnpj}
                  </p>

                  <p className="text-sm text-gray-500">
                    Telefone: {cliente.telefone}
                  </p>

                  <p className="text-sm text-gray-500">
                    E-mail: {cliente.email}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm text-blue-600">
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