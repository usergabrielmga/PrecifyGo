
import { useEffect, useState } from "react";
import type { Servico } from "../../services/servicoService";

type ServicoFormModalProps = {
  open: boolean;
  servico: Servico | null;
  onClose: () => void;
  onSave: (
    dados: Omit<Servico, "id_servico" | "criado_em">
  ) => Promise<void>;
};

export default function ServicoFormModal({
  open,
  servico,
  onClose,
  onSave,
}: ServicoFormModalProps) {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (open) {
      setNome(servico?.nome ?? "");
      setDescricao(servico?.descricao ?? "");
      setPreco(
        servico?.preco !== undefined ? String(servico.preco) : ""
      );
      setAtivo(servico?.ativo ?? true);
      setErro("");
    }
  }, [open, servico]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const precoNumerico = Number(preco.replace(",", "."));

    if (!nome.trim()) {
      setErro("Informe o nome do serviço.");
      return;
    }

    if (preco.trim() === "" || !Number.isFinite(precoNumerico) || precoNumerico < 0) {
      setErro("Informe um preço válido.");
      return;
    }

    try {
      setSalvando(true);

      await onSave({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: precoNumerico,
        ativo,
      });

      onClose();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível salvar o serviço."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#474646]">
            {servico ? "Editar serviço" : "Novo serviço"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-gray-400 hover:text-gray-700"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome do serviço *
            </label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Manutenção de componentes"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#EA2E52]"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o serviço"
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#EA2E52]"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Preço (R$) *
            </label>
            <input
              type="text"
              inputMode="decimal"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              placeholder="0,00"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#EA2E52]"
              required
            />
          </div>

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={ativo}
              onChange={(e) => setAtivo(e.target.checked)}
              className="h-4 w-4 accent-[#EA2E52]"
            />
            Serviço ativo
          </label>

          {erro && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {erro}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-[#EA2E52] px-5 py-2 font-medium text-white transition hover:bg-[#d92346] disabled:opacity-60"
            >
              {salvando ? "Salvando..." : "Salvar serviço"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
