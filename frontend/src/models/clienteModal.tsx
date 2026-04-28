import { useState } from "react"

type ClientePayload = {
  nome: string
  email: string
  telefone: string
  endereco?: string
  cpf_cnpj?: string
}

type Props = {
  onClose: () => void
  onSave: (data: ClientePayload) => void
}

export default function CreateClienteModal({ onClose, onSave }: Props) {
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [telefone, setTelefone] = useState("")
  const [endereco, setEndereco] = useState("")
  const [cpfCnpj, setCpfCnpj] = useState("")

  function handleSave() {
    if (!nome || !email || !telefone) {
      alert("Nome, email e telefone são obrigatórios")
      return
    }

    onSave({
      nome,
      email,
      telefone,
      endereco,
      cpf_cnpj: cpfCnpj
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Novo cliente</h2>

        <div className="space-y-3">
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

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="Endereço"
            value={endereco}
            onChange={(e) => setEndereco(e.target.value)}
          />

          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="CPF / CNPJ"
            value={cpfCnpj}
            onChange={(e) => setCpfCnpj(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded-lg bg-[#2a8837] text-white hover:opacity-90"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
