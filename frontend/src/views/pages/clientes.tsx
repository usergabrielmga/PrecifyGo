import { useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { Search, Mail, Phone } from "lucide-react";
import { motion } from "framer-motion";
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
  const [busca, setBusca] = useState("");

  const clientesFiltrados = clientes.filter((c) =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.email ?? "").toLowerCase().includes(busca.toLowerCase()) ||
    (c.telefone ?? "").toLowerCase().includes(busca.toLowerCase())
  );

  const initials = (nome: string) =>
    nome.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <main className="pt-10 px-4 sm:px-6 md:px-10 text-[#474646] min-h-screen bg-[#F9F9F9] rounded-2xl max-w-7xl mx-auto">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-gray-500">Gerencie sua base de clientes</p>
        </div>
        <button
          onClick={() => setCriandoCliente(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#EA2E52] text-white px-4 py-2 text-sm sm:text-base rounded-lg hover:opacity-90 transition"
        >
          <FaPlus /> Adicionar Cliente
        </button>
      </div>

      {/* BUSCA */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA2E52] focus:border-transparent"
          />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total de Clientes", valor: clientes.length },
          { label: "Com email", valor: clientes.filter((c) => c.email).length },
          { label: "Com telefone", valor: clientes.filter((c) => c.telefone).length },
        ].map(({ label, valor }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.07 }}
            className="bg-white border border-gray-200 rounded-xl p-5"
          >
            <p className="text-sm text-gray-500 mb-1">{label}</p>
            <p className="text-2xl font-semibold text-gray-900">{valor}</p>
          </motion.div>
        ))}
      </div>

      {/* CARDS — desktop e mobile usam o mesmo grid */}
      {clientesFiltrados.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-10">Nenhum cliente encontrado.</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {clientesFiltrados.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-11 h-11 bg-[#FEF2F4] rounded-full flex items-center justify-center text-sm font-semibold text-[#EA2E52]">
                  {initials(cliente.nome)}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setClienteEditando(cliente)}
                    className="text-gray-500 hover:text-blue-800 transition"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => setClienteParaDeletar(cliente.id)}
                    className="text-gray-500 hover:text-red-700 transition"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              <p className="font-semibold text-gray-900 mb-3">{cliente.nome}</p>

              <div className="flex flex-col gap-1.5 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cliente.email || "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-gray-400" />
                  <span>{cliente.telefone || "-"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAIS — intactos */}
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

      {criandoCliente && (
        <CreateClienteModal
          onClose={() => setCriandoCliente(false)}
          onSave={(data: Omit<Cliente, "id">) => {
            handleCreate(data);
            setCriandoCliente(false);
          }}
        />
      )}

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