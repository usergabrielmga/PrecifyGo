import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditClienteModal from "../../models/EditClienteModal";
import CreateClienteModal from "../../models/clienteModal";
import DeleteClientModal from "../../models/deleteClientModal";
import { useClient } from "../../hooks/useClient";
import type { Cliente } from "../../types/client";



export default function Clientes() {

  const { clientes, handleCreate, handleUpdate, handleDelete } = useClient();

  // ✅ estados de UI
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [criandoCliente, setCriandoCliente] = useState(false);
  const [clienteParaDeletar, setClienteParaDeletar] = useState<number | null>(null);

  return (
    <main className="pt-10 px-10 text-[#474646] min-h-screen bg-[#F9F9F9] rounded-2xl max-w-7xl mx-auto">
      
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-6">Clientes</h1>

        <button
          onClick={() => setCriandoCliente(true)}
          className="px-3 py-2 bg-[#2a8837] text-white rounded-lg hover:opacity-90 mb-6"
        >
          Adicionar Cliente
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-gray-500">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3 text-center">Ações</th>
            </tr>
          </thead>

          <tbody>
            {clientes.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                  Nenhum cliente cadastrado
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr key={cliente.id} className="border-b hover:bg-gray-50">
                  
                  <td className="px-4 py-3 font-medium">{cliente.nome}</td>
                  <td className="px-4 py-3">{cliente.email || "-"}</td>
                  <td className="px-4 py-3">{cliente.telefone || "-"}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">

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

      {/* EDITAR */}
      {clienteEditando && (
        <EditClienteModal
          cliente={clienteEditando}
          onClose={() => setClienteEditando(null)}
          onSave={(data) => {
            handleUpdate(clienteEditando.id, data as Omit<Cliente, "id">);
            setClienteEditando(null);
          }}
        />
      )}

      {/* CRIAR */}
      {criandoCliente && (
        <CreateClienteModal
          onClose={() => setCriandoCliente(false)}
          onSave={(data) => {
            handleCreate(data as Omit<Cliente, "id">);
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