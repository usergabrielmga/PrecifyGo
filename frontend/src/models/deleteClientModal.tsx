import { X } from "lucide-react";

type DeleteClientModalProps = {
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteClientModal({ onClose, onDelete }: DeleteClientModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/20"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-[400px]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Excluir cliente</h2>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p className="mb-6">
          Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
        </p>

        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 rounded-lg border hover:bg-gray-100"
            onClick={onClose}
          >
            Cancelar
          </button>

          <button
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
            onClick={onDelete}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}