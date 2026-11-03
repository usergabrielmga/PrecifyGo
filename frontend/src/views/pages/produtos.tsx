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
    <main className="mx-auto max-w-7xl rounded-2xl bg-[#F9F9F9] px-4 pt-10 text-[#474646] sm:px-6 md:px-10">

      {/* Cabeçalho */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">
            Produtos
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Visualize e gerencie seus produtos.
          </p>
        </div>

        <button
          type="button"
          onClick={abrirCadastro}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#EA2E52] px-5 py-3 font-medium text-white transition hover:bg-[#d92346]"
        >
          <FaPlus />
          Novo produto
        </button>
      </div>

      {/* Mensagem de sucesso */}
      {mensagem && (
        <div
          role="status"
          className="mb-5 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700"
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

      {/* Mensagem de erro */}
      {erro && (
        <div
          role="alert"
          className="mb-5 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
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

      {/* Resumo */}
      <section className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Total de produtos
          </p>

          <p className="mt-2 text-2xl font-bold">
            {produtos.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Produtos ativos
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {produtosAtivos}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="text-sm text-gray-500">
            Estoque total
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-500">
            {estoqueTotal}
          </p>
        </div>

      </section>

      {/* Busca e tabela */}
      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">

        {/* Busca */}
        <div className="border-b border-gray-200 p-4">
          <div className="relative max-w-md">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar produto por nome ou descrição..."
              className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#EA2E52] focus:ring-1 focus:ring-[#EA2E52]"
            />
          </div>
        </div>

        {/* Carregamento */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Carregando produtos...
          </div>

        ) : produtosFiltrados.length === 0 ? (

          /* Estado vazio */
          <div className="flex flex-col items-center px-4 py-12 text-center">
            <Package
              size={38}
              className="mb-3 text-gray-300"
            />

            <p className="font-medium text-gray-700">
              {busca
                ? "Nenhum produto encontrado"
                : "Nenhum produto cadastrado"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {busca
                ? "Tente pesquisar por outro termo."
                : "Clique em Novo produto para começar."}
            </p>
          </div>

        ) : (

          /* Tabela */
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">

              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">
                    Produto
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Preço
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Estoque
                  </th>

                  <th className="px-5 py-4 font-semibold">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right font-semibold">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {produtosFiltrados.map((produto) => (
                  <tr
                    key={produto.id_produto}
                    className="transition hover:bg-gray-50"
                  >

                    {/* Produto */}
                    <td className="px-5 py-4">
                      <p className="font-medium text-gray-800">
                        {produto.nome}
                      </p>

                      <p className="mt-1 max-w-sm truncate text-sm text-gray-500">
                        {produto.descricao || "Sem descrição"}
                      </p>
                    </td>

                    {/* Preço */}
                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {formatarPreco(produto.preco)}
                    </td>

                    {/* Estoque */}
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

                    {/* Status */}
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

                    {/* Ações */}
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
        )}

      </section>

      {/* Modal de cadastro, edição e entrada de estoque */}
      <ProdutoFormModal
        open={modalAberto}
        produto={produtoSelecionado}
        produtos={produtos}
        onClose={() => setModalAberto(false)}
        onSave={salvarProduto}
        onEntradaEstoque={handleEntradaEstoque}
      />

      <div className="h-10" />

    </main>
  );
}