import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditClienteModal from "../../models/EditClienteModal";
import CreateClienteModal from "../../models/clienteModal";
import DeleteClientModal from "../../models/deleteClientModal";
import { useClient } from "../../hooks/useClient";
import type { Cliente } from "../../types/client";

export default function Clientes() {
  const { clientes, handleCreate, handleUpdate, handleDelete } = useClient();

  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [criandoCliente, setCriandoCliente] = useState(false);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<number | null>(null);

  return (
    <main className="pt-10 px-4 sm:px-6 md:px-10 text-[#474646] min-h-screen bg-[#F9F9F9] rounded-2xl max-w-7xl mx-auto">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-xl sm:text-2xl font-bold">Clientes</h1>

        <button
          onClick={() => setCriandoCliente(true)}
          className="px-3 py-2 bg-[#2a8837] text-white rounded-lg hover:opacity-90 w-full sm:w-auto"
        >
          Adicionar Cliente
        </button>
      </div>

      {/* ===== DESKTOP (TABELA) ===== */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
  <table className="w-full text-sm">

    {/* HEADER */}
    <thead>
      <tr className="text-left text-gray-400 text-xs uppercase">
        <th className="px-6 py-4 font-medium">Nome</th>
        <th className="px-6 py-4 font-medium">Email</th>
        <th className="px-6 py-4 font-medium">Telefone</th>
        <th className="px-6 py-4 text-center font-medium">Ações</th>
      </tr>
    </thead>

    {/* BODY */}
    <tbody>
      {clientes.length === 0 ? (
        <tr>
          <td colSpan={4} className="px-6 py-10 text-center text-gray-400">
            Nenhum cliente cadastrado
          </td>
        </tr>
      ) : (
        clientes.map((cliente) => (
          <tr
            key={cliente.id}
            className="hover:bg-gray-50 transition"
          >
            <td className="px-6 py-4 font-medium">
              {cliente.nome}
            </td>

            <td className="px-6 py-4 text-gray-500">
              {cliente.email || "-"}
            </td>

            <td className="px-6 py-4 text-gray-500">
              {cliente.telefone || "-"}
            </td>

            <td className="px-6 py-4">
              <div className="flex justify-center gap-4 opacity-70 hover:opacity-100 transition">

                <button
                  onClick={() => setClienteEditando(cliente)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setClienteParaDeletar(cliente.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>

              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>

  </table>
</div>

      {/* ===== MOBILE (CARDS) ===== */}
      <div className="md:hidden space-y-3">
        {clientes.length === 0 ? (
          <div className="text-center text-gray-400 py-6">
            Nenhum cliente cadastrado
          </div>
        ) : (
          clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            >
              <p className="font-medium">{cliente.nome}</p>
              <p className="text-sm text-gray-500">
                {cliente.email || "-"}
              </p>
              <p className="text-sm text-gray-500 mb-3">
                {cliente.telefone || "-"}
              </p>

              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setClienteEditando(cliente)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <FaEdit />
                </button>

                <button
                  onClick={() => setClienteParaDeletar(cliente.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* EDITAR */}
      {clienteEditando && (
        <EditClienteModal
          cliente={clienteEditando}
          onClose={() => setClienteEditando(null)}
          onSave={(data: Omit<Cliente, "id">) => {
            handleUpdate(clienteEditando.id, data);
            setClienteEditando(null);
          }}
        />
      )}

      {/* CRIAR */}
      {criandoCliente && (
        <CreateClienteModal
          onClose={() => setCriandoCliente(false)}
          onSave={(data: Omit<Cliente, "id">) => {
            handleCreate(data);
            setCriandoCliente(false);
          }}
        />
      )}

      {/* DELETAR */}
      {clienteParaDeletar && (
        <DeleteClientModal
          onClose={() => setClienteParaDeletar(null)}
          onDelete={() => {
            handleDelete(clienteParaDeletar);
            setClienteParaDeletar(null);
          }}
        />
      )}
    </main>
  );
}