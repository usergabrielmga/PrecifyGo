
import { useEffect, useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Search, CarFront } from "lucide-react";
import { useVeiculo } from "../../hooks/useVeiculo";
import { useClient } from "../../hooks/useClient";
import type { Veiculo, VeiculoPayload } from "../../types/veiculo";
import { useNotification } from "../../context/useNotification";

const vazio: VeiculoPayload = {
  cliente_id: 0,
  marca: "",
  modelo: "",
  placa: "",
  ano: null,
  cor: "",
  observacoes: "",
};

export default function Veiculos() {
  const { veiculos, loading, erro, handleCreate, handleUpdate, handleDelete } =
    useVeiculo();

  const { clientes } = useClient();
  const { showNotification } = useNotification();

  const [busca, setBusca] = useState("");
  const [modal, setModal] = useState(false);
  const [editando, setEditando] = useState<Veiculo | null>(null);
  const [form, setForm] = useState<VeiculoPayload>(vazio);
  const [salvando, setSalvando] = useState(false);

  const filtrados = veiculos.filter((v) =>
    `${v.marca} ${v.modelo} ${v.placa} ${v.nome_cliente || ""}`
      .toLowerCase()
      .includes(busca.toLowerCase())
  );

  function abrirNovo() {
    setEditando(null);
    setForm(vazio);
    setModal(true);
  }

  function abrirEdicao(v: Veiculo) {
    setEditando(v);
    setForm({
      cliente_id: v.cliente_id,
      marca: v.marca,
      modelo: v.modelo,
      placa: v.placa,
      ano: v.ano,
      cor: v.cor || "",
      observacoes: v.observacoes || "",
    });
    setModal(true);
  }

  async function salvar(e: React.FormEvent) {
    e.preventDefault();
    setSalvando(true);

    try {
      if (editando) {
        await handleUpdate(editando.id_veiculo, form);
        showNotification("Veículo atualizado com sucesso");
      } else {
        await handleCreate(form);
        showNotification("Veículo cadastrado com sucesso");
      }

      setModal(false);
      setEditando(null);
      setForm(vazio);
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erro ao salvar veículo"
      );
    } finally {
      setSalvando(false);
    }
  }

  async function excluir(id: number) {
    if (!window.confirm("Deseja realmente excluir este veículo?")) return;

    try {
      await handleDelete(id);
      showNotification("Veículo excluído com sucesso");
    } catch (error) {
      showNotification(
        error instanceof Error ? error.message : "Erro ao excluir veículo"
      );
    }
  }

  useEffect(() => {
    if (clientes.length === 0) return;
  }, [clientes]);

  return (
    <main className="w-full max-w-[1250px] mx-auto min-h-screen bg-[#F9F9F9] text-gray-700 p-3 md:p-6 lg:p-7">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            Veículos
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Gerencie os veículos cadastrados dos seus clientes
          </p>
        </div>

        <button
          onClick={abrirNovo}
          disabled={clientes.length === 0}
          className="flex items-center justify-center gap-2 bg-[#EA2E52] text-white px-4 py-2.5 text-sm rounded-lg hover:bg-[#d92549] disabled:opacity-50"
        >
          <FaPlus size={11} />
          Adicionar veículo
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Total de veículos</p>
          <p className="text-2xl font-semibold text-gray-900">
            {veiculos.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-500">Clientes com veículos</p>
          <p className="text-2xl font-semibold text-gray-900">
            {new Set(veiculos.map(v => v.cliente_id)).size}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-3 mb-5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por modelo, placa ou cliente..."
            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#EA2E52]/20"
          />
        </div>
      </div>

      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-gray-800">
          Lista de veículos
        </h2>
        <span className="text-xs text-gray-500">
          {filtrados.length} encontrados
        </span>
      </div>

      {loading ? (
        <div className="bg-white rounded-xl p-10 text-center text-sm text-gray-500">
          Carregando veículos...
        </div>
      ) : erro ? (
        <div className="bg-white rounded-xl p-10 text-center text-sm text-red-500">
          {erro}
        </div>
      ) : filtrados.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <CarFront className="mx-auto text-gray-300 mb-3" size={35} />
          <p className="text-sm text-gray-500">
            Nenhum veículo cadastrado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtrados.map(v => (
            <div
              key={v.id_veiculo}
              className="bg-white border border-gray-200 rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF2F4] text-[#EA2E52] flex items-center justify-center shrink-0">
                    <CarFront size={22} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-gray-900">
                      {v.marca} {v.modelo}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {v.nome_cliente}
                    </p>
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    onClick={() => abrirEdicao(v)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                    title="Editar"
                  >
                    <FaEdit size={13} />
                  </button>
                  <button
                    onClick={() => excluir(v.id_veiculo)}
                    className="p-2 text-gray-400 hover:text-red-600"
                    title="Excluir"
                  >
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400">PLACA</p>
                  <p className="text-sm font-semibold text-gray-700">
                    {v.placa}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">ANO</p>
                  <p className="text-sm text-gray-700">{v.ano || "Não informado"}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">COR</p>
                  <p className="text-sm text-gray-700">{v.cor || "Não informada"}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center p-3">
          <form
            onSubmit={salvar}
            className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-5"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {editando ? "Editar veículo" : "Cadastrar veículo"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Cliente *</label>
                <select
                  required
                  value={form.cliente_id || ""}
                  onChange={e => setForm({...form, cliente_id: Number(e.target.value)})}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mt-1"
                >
                  <option value="">Selecione um cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Marca *</label>
                  <input required value={form.marca}
                    onChange={e => setForm({...form, marca: e.target.value})}
                    placeholder="Toyota"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mt-1" />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Modelo *</label>
                  <input required value={form.modelo}
                    onChange={e => setForm({...form, modelo: e.target.value})}
                    placeholder="Hilux"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mt-1" />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Placa *</label>
                  <input required maxLength={7} value={form.placa}
                    onChange={e => setForm({...form, placa: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "")})}
                    placeholder="ABC1D23"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mt-1 uppercase" />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Ano</label>
                  <input type="number" min="1886" max="2100"
                    value={form.ano ?? ""}
                    onChange={e => setForm({...form, ano: e.target.value ? Number(e.target.value) : null})}
                    placeholder="2022"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mt-1" />
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-600">Cor</label>
                  <input value={form.cor}
                    onChange={e => setForm({...form, cor: e.target.value})}
                    placeholder="Branca"
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mt-1" />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600">Observações</label>
                <textarea value={form.observacoes}
                  onChange={e => setForm({...form, observacoes: e.target.value})}
                  rows={3}
                  className="w-full border border-gray-200 rounded-lg p-2.5 text-sm mt-1"
                  placeholder="Informações adicionais..." />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button type="button" onClick={() => setModal(false)}
                className="px-4 py-2 text-sm border rounded-lg">
                Cancelar
              </button>
              <button disabled={salvando} type="submit"
                className="px-4 py-2 text-sm bg-[#EA2E52] text-white rounded-lg disabled:opacity-50">
                {salvando ? "Salvando..." : "Salvar veículo"}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
