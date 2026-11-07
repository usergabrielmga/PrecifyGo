
import { useCallback, useEffect, useState } from "react";
import { Search, Plus, Pencil, Trash2, Wrench } from "lucide-react";

import ServicoFormModal from "../components/ServicoFormModal";
import {
  listarServicos,
  criarServico,
  atualizarServico,
  excluirServico,
} from "../../services/servicoService";

import type { Servico } from "../../services/servicoService";

export default function Servicos() {
  const [servicos, setServicos] = useState<Servico[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [servicoSelecionado, setServicoSelecionado] =
    useState<Servico | null>(null);

  const carregarServicos = useCallback(async () => {
    try {
      setErro("");
      const dados = await listarServicos();
      setServicos(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os serviços."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarServicos();
  }, [carregarServicos]);

  const servicosFiltrados = servicos.filter((servico) => {
    const termo = busca.toLowerCase();

    return (
      servico.nome.toLowerCase().includes(termo) ||
      (servico.descricao ?? "").toLowerCase().includes(termo)
    );
  });

  const abrirCadastro = () => {
    setServicoSelecionado(null);
    setModalAberto(true);
  };

  const abrirEdicao = (servico: Servico) => {
    setServicoSelecionado(servico);
    setModalAberto(true);
  };

  const salvarServico = async (
    dados: Omit<Servico, "id_servico" | "criado_em">
  ) => {
    if (servicoSelecionado) {
      await atualizarServico(servicoSelecionado.id_servico, dados);
      setMensagem("Serviço atualizado com sucesso!");
    } else {
      await criarServico(dados);
      setMensagem("Serviço cadastrado com sucesso!");
    }

    await carregarServicos();
  };

  const removerServico = async (servico: Servico) => {
    const confirmou = window.confirm(
      `Deseja realmente excluir o serviço "${servico.nome}"?`
    );

    if (!confirmou) return;

    try {
      setErro("");
      setMensagem("");

      await excluirServico(servico.id_servico);
      setMensagem("Serviço excluído com sucesso!");

      await carregarServicos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o serviço."
      );
    }
  };

  const formatarPreco = (preco: number) =>
    Number(preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const ativos = servicos.filter((servico) => servico.ativo).length;

  return (
    <main className="mx-auto max-w-7xl rounded-2xl bg-[#F9F9F9] px-3 pt-5 text-[#474646] sm:px-6 sm:pt-8 md:px-10 md:pt-10">
      {/* Cabeçalho */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Serviços</h1>

          <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
            Cadastre e gerencie os serviços oferecidos.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#EA2E52] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92346] sm:px-5 sm:py-3 sm:text-base"
        >
          <Plus size={18} />
          Novo serviço
        </button>
      </div>

      {/* Mensagem de sucesso */}
      {mensagem && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs text-green-700 sm:mb-5 sm:p-3 sm:text-sm">
          <span>{mensagem}</span>

          <button
            type="button"
            onClick={() => setMensagem("")}
            aria-label="Fechar mensagem"
          >
            ×
          </button>
        </div>
      )}

      {/* Mensagem de erro */}
      {erro && (
        <div className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600 sm:mb-5 sm:p-3 sm:text-sm">
          <span>{erro}</span>

          <button
            type="button"
            onClick={() => setErro("")}
            aria-label="Fechar erro"
          >
            ×
          </button>
        </div>
      )}

      {/* Resumo */}
      <section className="mb-4 grid grid-cols-3 gap-2 sm:mb-5 sm:gap-4">
        <div className="rounded-xl border border-gray-200 bg-white p-2.5 sm:p-4">
          <p className="text-[10px] text-gray-500 sm:text-sm">
            Total de serviços
          </p>
          <p className="mt-1 text-xl font-bold sm:mt-2 sm:text-2xl">
            {servicos.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-2.5 sm:p-4">
          <p className="text-[10px] text-gray-500 sm:text-sm">
            Serviços ativos
          </p>
          <p className="mt-1 text-xl font-bold text-green-600 sm:mt-2 sm:text-2xl">
            {ativos}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-2.5 sm:p-4">
          <p className="text-[10px] text-gray-500 sm:text-sm">
            Inativos
          </p>
          <p className="mt-1 text-xl font-bold text-gray-500 sm:mt-2 sm:text-2xl">
            {servicos.length - ativos}
          </p>
        </div>
      </section>

      {/* Busca e listagem */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-3 sm:p-4">
          <div className="relative max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar por nome ou descrição..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-xs outline-none transition focus:border-[#EA2E52] focus:ring-1 focus:ring-[#EA2E52] sm:py-3 sm:pr-4 sm:text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 sm:p-10">
            Carregando serviços...
          </div>
        ) : servicosFiltrados.length === 0 ? (
          <div className="flex flex-col items-center px-4 py-10 text-center sm:py-12">
            <Wrench size={34} className="mb-3 text-gray-300" />

            <p className="text-sm font-medium text-gray-700">
              {busca
                ? "Nenhum serviço encontrado"
                : "Nenhum serviço cadastrado"}
            </p>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {busca
                ? "Tente pesquisar por outro termo."
                : "Clique em Novo serviço para começar."}
            </p>
          </div>
        ) : (
          <>
            {/* Tabela - Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Serviço</th>
                    <th className="px-5 py-4 font-semibold">Preço</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {servicosFiltrados.map((servico) => (
                    <tr
                      key={servico.id_servico}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {servico.nome}
                        </p>

                        <p className="mt-1 max-w-sm truncate text-sm text-gray-500">
                          {servico.descricao || "Sem descrição"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        {formatarPreco(servico.preco)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            servico.ativo
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {servico.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(servico)}
                            title="Editar serviço"
                            aria-label={`Editar ${servico.nome}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[#EA2E52]"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => void removerServico(servico)}
                            title="Excluir serviço"
                            aria-label={`Excluir ${servico.nome}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards - Mobile */}
            <div className="divide-y divide-gray-100 md:hidden">
              {servicosFiltrados.map((servico) => (
                <div
                  key={servico.id_servico}
                  className="p-3 transition hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {servico.nome}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {servico.descricao || "Sem descrição"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                        servico.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {servico.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-gray-800">
                      {formatarPreco(servico.preco)}
                    </p>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(servico)}
                        title="Editar serviço"
                        aria-label={`Editar ${servico.nome}`}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[#EA2E52]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void removerServico(servico)}
                        title="Excluir serviço"
                        aria-label={`Excluir ${servico.nome}`}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* Modal */}
      <ServicoFormModal
        open={modalAberto}
        servico={servicoSelecionado}
        onClose={() => setModalAberto(false)}
        onSave={salvarServico}
      />

      <div className="h-8 sm:h-10" />
    </main>
  );
}
