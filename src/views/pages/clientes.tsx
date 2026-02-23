import { useEffect, useState } from "react";
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from "../../services/clienteService";
import { FaEdit, FaTrash } from "react-icons/fa";
import EditClienteModal from "../../models/EditClienteModal";
import CreateClienteModal from "../../models/clienteModal";

type Cliente = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  endereco?: string;
  cpf_cnpj?: string;
};

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [criandoCliente, setCriandoCliente] = useState(false);

  useEffect(() => {
    getClientes().then(setClientes);
  }, []);

async function handleCreate(data: Omit<Cliente, "id">) {
    try {
      const { clienteId } = await createCliente(data as any)

setClientes(prev => [
  ...prev,
  {
    id: clienteId,
    nome: data.nome,
    email: data.email,
    telefone: data.telefone,
    endereco: data.endereco,
    cpf_cnpj: data.cpf_cnpj
  }
])
    } catch (error) {
      alert("Erro ao criar cliente");
      console.error(error);
    }
  }

  function handleEdit(cliente: Cliente) {
    setClienteEditando(cliente);
  }

  async function handleSave(data: Omit<Cliente, "id">) {
    if (!clienteEditando || !data.nome) return;

    try {
      await updateCliente(clienteEditando.id, {
        nome: data.nome,
        email: data.email || "",
        telefone: data.telefone || "",
      });

      setClientes((prev) =>
        prev.map((c) =>
          c.id === clienteEditando.id
            ? {
                ...c,
                nome: data.nome,
                email: data.email || "",
                telefone: data.telefone || "",
              }
            : c
        )
      );

      setClienteEditando(null);
    } catch (error) {
      alert("Erro ao atualizar cliente");
      console.error(error);
    }
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este cliente?"
    );

    if (!confirmDelete) return;

    try {
      await deleteCliente(id);
      setClientes((prev) => prev.filter((cliente) => cliente.id !== id));
    } catch (error) {
      alert(
        "Este cliente possui orçamentos vinculados e não pode ser excluído."
      );
      console.error(error);
    }
  }

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
              <tr key="empty">
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-gray-400"
                >
                  Nenhum cliente cadastrado
                </td>
              </tr>
            ) : (
              clientes.map((cliente) => (
                <tr
                  key={cliente.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 font-medium">{cliente.nome}</td>
                  <td className="px-4 py-3">{cliente.email || "-"}</td>
                  <td className="px-4 py-3">{cliente.telefone || "-"}</td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="text-blue-600 hover:text-blue-800 transition"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(cliente.id)}
                        className="text-red-600 hover:text-red-800 transition"
                        title="Excluir"
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

      {clienteEditando && (
        <EditClienteModal
          cliente={clienteEditando}
          onClose={() => setClienteEditando(null)}
          onSave={handleSave}
        />
      )}

      {criandoCliente && (
        <CreateClienteModal
          onClose={() => setCriandoCliente(false)}
          onSave={handleCreate}
        />
      )}
    </main>
  );
}
