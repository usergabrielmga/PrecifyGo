
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

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      (c.email ?? "").toLowerCase().includes(busca.toLowerCase()) ||
      (c.telefone ?? "").toLowerCase().includes(busca.toLowerCase())
  );

  const initials = (nome: string) =>
    nome
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  return (
    <main className="w-full max-w-[1250px] mx-auto min-h-screen bg-[#F9F9F9] text-gray-700 p-4 md:p-6 lg:p-7">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Clientes
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gerencie sua base de clientes
          </p>
        </div>

        <button
          onClick={() => setCriandoCliente(true)}
          className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#EA2E52] text-white px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-[#d92549] transition"
        >
          <FaPlus size={12} />
          Adicionar cliente
        </button>
      </div>

      {/* BUSCA */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />

          <input
            type="text"
            placeholder="Buscar por nome, email ou telefone..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA2E52]/20 focus:border-[#EA2E52] transition"
          />
        </div>
      </div>

      {/* INDICADORES */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Total de clientes",
            valor: clientes.length,
          },
          {
            label: "Com email",
            valor: clientes.filter((c) => c.email).length,
          },
          {
            label: "Com telefone",
            valor: clientes.filter((c) => c.telefone).length,
          },
        ].map(({ label, valor }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="bg-white border border-gray-200 rounded-xl p-4"
          >
            <p className="text-xs font-medium text-gray-500 mb-1">
              {label}
            </p>

            <p className="text-2xl font-semibold text-gray-900">
              {valor}
            </p>
          </motion.div>
        ))}
      </div>

      {/* LISTA DE CLIENTES */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Lista de clientes
        </h2>

        <span className="text-xs text-gray-500">
          {clientesFiltrados.length} encontrados
        </span>
      </div>

      {clientesFiltrados.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl text-center py-12 px-4">
          <p className="text-sm text-gray-500">
            Nenhum cliente encontrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {clientesFiltrados.map((cliente, index) => (
            <motion.div
              key={cliente.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.04 }}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* CABEÇALHO DO CARD */}
              <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#FEF2F4] rounded-full flex items-center justify-center text-sm font-semibold text-[#EA2E52] shrink-0">
                    {initials(cliente.nome)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 break-words">
                      {cliente.nome}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      Cliente #{cliente.id}
                    </p>
                  </div>
                </div>

                {/* AÇÕES */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setClienteEditando(cliente)}
                    title="Editar cliente"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                  >
                    <FaEdit size={14} />
                  </button>

                  <button
                    onClick={() => setClienteParaDeletar(cliente.id)}
                    title="Excluir cliente"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    <FaTrash size={13} />
                  </button>
                </div>
              </div>

              {/* INFORMAÇÕES */}
              <div className="border-t border-gray-100 pt-3 flex flex-col gap-3">
                <div className="flex items-start gap-2.5 min-w-0">
                  <Mail
                    size={15}
                    className="text-gray-400 mt-0.5 shrink-0"
                  />

                  <span className="text-xs text-gray-600 break-all">
                    {cliente.email || "Email não informado"}
                  </span>
                </div>

                <div className="flex items-start gap-2.5 min-w-0">
                  <Phone
                    size={15}
                    className="text-gray-400 mt-0.5 shrink-0"
                  />

                  <span className="text-xs text-gray-600 break-words">
                    {cliente.telefone || "Telefone não informado"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAIS */}
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
