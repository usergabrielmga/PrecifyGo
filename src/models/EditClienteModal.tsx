import { useState } from "react";

type Cliente = {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
};

type Props = {
  cliente: Cliente;
  onClose: () => void;
  onSave: (data: Omit<Cliente, "id">) => void;
};

export default function EditClienteModal({ cliente, onClose, onSave }: Props) {
  const [nome, setNome] = useState(cliente.nome);
  const [email, setEmail] = useState(cliente.email || "");
  const [telefone, setTelefone] = useState(cliente.telefone || "");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Editar cliente</h2>

        <div className="space-y-4">
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            onClick={() => onSave({ nome, email, telefone })}
            className="px-4 py-2 rounded-lg bg-[#EA2E52] text-white hover:opacity-90"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
