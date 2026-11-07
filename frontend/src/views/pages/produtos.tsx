
import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Search, Package, Pencil, Trash2 } from "lucide-react";

import ProdutoFormModal from "../components/ProdutoFormModal";
import {
  listarProdutos,
  criarProduto,
  atualizarProduto,
  excluirProduto,
  registrarEntradaEstoque,
  type Produto,
} from "../../services/produtoService";

type DadosProduto = Omit<Produto, "id_produto" | "criado_em">;

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] =
    useState<Produto | null>(null);
  const [mensagem, setMensagem] = useState("");

  const carregarProdutos = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const dados = await listarProdutos();
      setProdutos(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os produtos."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void carregarProdutos();
  }, [carregarProdutos]);

  const produtosFiltrados = produtos.filter((produto) => {
    const termo = busca.trim().toLowerCase();

    return (
      produto.nome.toLowerCase().includes(termo) ||
      (produto.descricao ?? "").toLowerCase().includes(termo)
    );
  });

  function abrirCadastro() {
    setProdutoSelecionado(null);
    setMensagem("");
    setErro("");
    setModalAberto(true);
  }

  function abrirEdicao(produto: Produto) {
    setProdutoSelecionado(produto);
    setMensagem("");
    setErro("");
    setModalAberto(true);
  }

  async function salvarProduto(dados: DadosProduto) {
    if (produtoSelecionado) {
      await atualizarProduto(produtoSelecionado.id_produto, dados);
      setMensagem("Produto atualizado com sucesso!");
    } else {
      await criarProduto(dados);
      setMensagem("Produto cadastrado com sucesso!");
    }

    await carregarProdutos();
  }

  async function handleEntradaEstoque(
    produtoId: number,
    quantidade: number
  ) {
    setErro("");
    setMensagem("");

    try {
      await registrarEntradaEstoque(produtoId, quantidade);

      setMensagem("Entrada de estoque registrada com sucesso!");

      await carregarProdutos();
    } catch (error) {
      const mensagemErro =
        error instanceof Error
          ? error.message
          : "Não foi possível registrar a entrada de estoque.";

      setErro(mensagemErro);

      throw error;
    }
  }

  async function handleExcluir(produto: Produto) {
    const confirmou = window.confirm(
      `Deseja realmente excluir o produto "${produto.nome}"?`
    );

    if (!confirmou) return;

    setErro("");
    setMensagem("");

    try {
      await excluirProduto(produto.id_produto);
      setMensagem("Produto excluído com sucesso!");
      await carregarProdutos();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir o produto."
      );
    }
  }

  const formatarPreco = (preco: number) =>
    Number(preco).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const produtosAtivos = produtos.filter(
    (produto) => produto.ativo
  ).length;

  const estoqueTotal = produtos.reduce(
    (total, produto) => total + Number(produto.estoque),
    0
  );

  return (
    <main className="mx-auto max-w-7xl rounded-2xl bg-[#F9F9F9] px-3 pt-5 text-[#474646] sm:px-6 sm:pt-8 md:px-10 md:pt-10">

      {/* CABEÇALHO */}
      <div className="mb-5 flex flex-col justify-between gap-3 sm:mb-8 sm:flex-row sm:items-center sm:gap-4">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            Produtos
          </h1>

          <p className="mt-1 text-xs text-gray-500 sm:mt-2 sm:text-sm">
            Visualize e gerencie seus produtos.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#EA2E52] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#d92346] sm:px-5 sm:py-3 sm:text-base"
        >
          <FaPlus size={14} />
          Novo produto
        </button>
      </div>

      {/* MENSAGEM DE SUCESSO */}
      {mensagem && (
        <div
          role="status"
          className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-2.5 text-xs text-green-700 sm:mb-5 sm:p-3 sm:text-sm"
        >
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

      {/* MENSAGEM DE ERRO */}
      {erro && (
        <div
          role="alert"
          className="mb-4 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700 sm:mb-5 sm:p-3 sm:text-sm"
        >
          <span>{erro}</span>

          <button
            type="button"
            onClick={() => void carregarProdutos()}
            className="ml-3 shrink-0 font-semibold underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* RESUMO */}
      <section className="mb-4 grid grid-cols-3 gap-2 sm:mb-5 sm:gap-4">

        <div className="rounded-xl border border-gray-200 bg-white p-2.5 sm:p-4">
          <p className="text-[10px] text-gray-500 sm:text-sm">
            Total de produtos
          </p>

          <p className="mt-1 text-xl font-bold sm:mt-2 sm:text-2xl">
            {produtos.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-2.5 sm:p-4">
          <p className="text-[10px] text-gray-500 sm:text-sm">
            Produtos ativos
          </p>

          <p className="mt-1 text-xl font-bold text-green-600 sm:mt-2 sm:text-2xl">
            {produtosAtivos}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-2.5 sm:p-4">
          <p className="text-[10px] text-gray-500 sm:text-sm">
            Estoque total
          </p>

          <p className="mt-1 text-xl font-bold text-gray-500 sm:mt-2 sm:text-2xl">
            {estoqueTotal}
          </p>
        </div>

      </section>

      {/* BUSCA E LISTAGEM */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        {/* BUSCA */}
        <div className="border-b border-gray-200 p-3 sm:p-4">
          <div className="relative w-full md:max-w-md">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produto por nome ou descrição..."
              className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-xs outline-none transition focus:border-[#EA2E52] focus:ring-1 focus:ring-[#EA2E52] sm:py-3 sm:pr-4 sm:text-sm"
            />
          </div>
        </div>

        {/* CARREGAMENTO */}
        {loading ? (
          <div className="p-8 text-center text-sm text-gray-500 sm:p-10">
            Carregando produtos...
          </div>

        ) : produtosFiltrados.length === 0 ? (

          /* ESTADO VAZIO */
          <div className="flex flex-col items-center px-4 py-10 text-center sm:py-12">
            <Package
              size={34}
              className="mb-3 text-gray-300"
            />

            <p className="text-sm font-medium text-gray-700">
              {busca
                ? "Nenhum produto encontrado"
                : "Nenhum produto cadastrado"}
            </p>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              {busca
                ? "Tente pesquisar por outro termo."
                : "Clique em Novo produto para começar."}
            </p>
          </div>

        ) : (

          <>
            {/* TABELA DESKTOP */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left">

                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Produto</th>
                    <th className="px-5 py-4 font-semibold">Preço</th>
                    <th className="px-5 py-4 font-semibold">Estoque</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 text-right font-semibold">Ações</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {produtosFiltrados.map((produto) => (
                    <tr
                      key={produto.id_produto}
                      className="transition hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-gray-800">
                          {produto.nome}
                        </p>

                        <p className="mt-1 max-w-sm truncate text-sm text-gray-500">
                          {produto.descricao || "Sem descrição"}
                        </p>
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-medium">
                        {formatarPreco(produto.preco)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={
                            Number(produto.estoque) === 0
                              ? "font-medium text-red-600"
                              : "text-gray-600"
                          }
                        >
                          {produto.estoque}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            produto.ativo
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {produto.ativo ? "Ativo" : "Inativo"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => abrirEdicao(produto)}
                            title="Editar produto"
                            aria-label={`Editar ${produto.nome}`}
                            className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[#EA2E52]"
                          >
                            <Pencil size={18} />
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleExcluir(produto)}
                            title="Excluir produto"
                            aria-label={`Excluir ${produto.nome}`}
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

            {/* CARDS MOBILE */}
            <div className="divide-y divide-gray-100 md:hidden">
              {produtosFiltrados.map((produto) => (
                <div
                  key={produto.id_produto}
                  className="p-3 transition hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-gray-800">
                        {produto.nome}
                      </p>

                      <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                        {produto.descricao || "Sem descrição"}
                      </p>
                    </div>

                    <span
                      className={`inline-flex shrink-0 rounded-full px-2 py-1 text-[10px] font-medium ${
                        produto.ativo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {produto.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-xs text-gray-400">Preço</p>
                        <p className="text-sm font-bold text-gray-800">
                          {formatarPreco(produto.preco)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-400">Estoque</p>
                        <p
                          className={`text-sm font-bold ${
                            Number(produto.estoque) === 0
                              ? "text-red-600"
                              : "text-gray-700"
                          }`}
                        >
                          {produto.estoque}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEdicao(produto)}
                        title="Editar produto"
                        aria-label={`Editar ${produto.nome}`}
                        className="rounded-lg border border-gray-200 p-2 text-gray-500 transition hover:bg-pink-50 hover:text-[#EA2E52]"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => void handleExcluir(produto)}
                        title="Excluir produto"
                        aria-label={`Excluir ${produto.nome}`}
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

      {/* MODAL DE CADASTRO, EDIÇÃO E ENTRADA DE ESTOQUE */}
      <ProdutoFormModal
        open={modalAberto}
        produto={produtoSelecionado}
        produtos={produtos}
        onClose={() => setModalAberto(false)}
        onSave={salvarProduto}
        onEntradaEstoque={handleEntradaEstoque}
      />

      <div className="h-8 sm:h-10" />

    </main>
  );
}
