import { useEffect, useState } from "react";
import type { Produto } from "../../services/produtoService";

type ProdutoFormModalProps = {
  open: boolean;
  produto: Produto | null;
  produtos: Produto[];
  onClose: () => void;
  onSave: (
    dados: Omit<Produto, "id_produto" | "criado_em">
  ) => Promise<void>;
  onEntradaEstoque: (
    produtoId: number,
    quantidade: number
  ) => Promise<void>;
};

type Aba = "dados" | "entrada";

export default function ProdutoFormModal({
  open,
  produto,
  produtos,
  onClose,
  onSave,
  onEntradaEstoque,
}: ProdutoFormModalProps) {
  const [aba, setAba] = useState<Aba>("dados");

  // Dados do produto
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [estoque, setEstoque] = useState("");
  const [ativo, setAtivo] = useState(true);

  // Entrada de estoque
  const [produtoEntrada, setProdutoEntrada] = useState("");
  const [quantidadeEntrada, setQuantidadeEntrada] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (!open) return;

    setAba("dados");

    setNome(produto?.nome ?? "");
    setDescricao(produto?.descricao ?? "");
    setPreco(produto ? String(produto.preco) : "");
    setEstoque(produto ? String(produto.estoque) : "");
    setAtivo(produto?.ativo ?? true);

    setProdutoEntrada("");
    setQuantidadeEntrada("");
    setErro("");
  }, [open, produto]);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const precoNumero = Number(preco);
    const estoqueNumero = Number(estoque);

    if (!nome.trim()) {
      setErro("Informe o nome do produto.");
      return;
    }

    if (
      preco.trim() === "" ||
      !Number.isFinite(precoNumero) ||
      precoNumero < 0
    ) {
      setErro("Informe um preço válido, igual ou maior que zero.");
      return;
    }

    if (
      estoque.trim() === "" ||
      !Number.isInteger(estoqueNumero) ||
      estoqueNumero < 0
    ) {
      setErro("Informe um estoque inteiro, igual ou maior que zero.");
      return;
    }

    setSalvando(true);

    try {
      await onSave({
        nome: nome.trim(),
        descricao: descricao.trim(),
        preco: precoNumero,
        estoque: estoqueNumero,
        ativo,
      });

      onClose();
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao salvar produto."
      );
    } finally {
      setSalvando(false);
    }
  }

  async function handleEntrada(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro("");

    const produtoId = Number(produtoEntrada);
    const quantidade = Number(quantidadeEntrada);

    if (!produtoEntrada) {
      setErro("Selecione um produto.");
      return;
    }

    if (
      quantidadeEntrada.trim() === "" ||
      !Number.isInteger(quantidade) ||
      quantidade <= 0
    ) {
      setErro("Informe uma quantidade inteira maior que zero.");
      return;
    }

    setSalvando(true);

    try {
      await onEntradaEstoque(produtoId, quantidade);

      onClose();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao registrar entrada de estoque."
      );
    } finally {
      setSalvando(false);
    }
  }

  const produtoSelecionado = produtos.find(
    (item) => item.id_produto === Number(produtoEntrada)
  );

  const estoqueAtual = Number(produtoSelecionado?.estoque ?? 0);
  const novaQuantidade = Number(quantidadeEntrada) || 0;
  const estoqueFinal = estoqueAtual + novaQuantidade;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={salvando ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl"
      >
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-semibold text-[#474646]">
              {aba === "entrada"
                ? "Entrada de estoque"
                : produto
                  ? "Editar produto"
                  : "Novo produto"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {aba === "entrada"
                ? "Adicione unidades a um produto já cadastrado."
                : "Preencha os dados do produto."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={salvando}
            className="text-xl text-gray-500 hover:text-black disabled:opacity-50"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Abas */}
        <div className="grid grid-cols-2 border-b">
          <button
            type="button"
            onClick={() => {
              setAba("dados");
              setErro("");
            }}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              aba === "dados"
                ? "border-[#EA2E52] text-[#EA2E52]"
                : "border-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            Dados do produto
          </button>

          <button
            type="button"
            onClick={() => {
              setAba("entrada");
              setErro("");
            }}
            className={`border-b-2 px-4 py-3 text-sm font-medium transition ${
              aba === "entrada"
                ? "border-[#EA2E52] text-[#EA2E52]"
                : "border-transparent text-gray-500 hover:bg-gray-50"
            }`}
          >
            Entrada de estoque
          </button>
        </div>

        {/* Formulário de produto */}
        {aba === "dados" && (
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Nome *
                </label>

                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  maxLength={150}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#EA2E52] focus:ring-2 focus:ring-[#EA2E52]/20"
                  placeholder="Ex.: valvula de controle"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Descrição
                </label>

                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#EA2E52] focus:ring-2 focus:ring-[#EA2E52]/20"
                  placeholder="Descrição do produto"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Preço (R$) *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={preco}
                    onChange={(e) => setPreco(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#EA2E52]"
                    placeholder="0,00"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Estoque *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={estoque}
                    onChange={(e) => setEstoque(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#EA2E52]"
                    placeholder="0"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={ativo}
                  onChange={(e) => setAtivo(e.target.checked)}
                  className="accent-[#EA2E52]"
                />
                Produto ativo
              </label>

              {erro && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {erro}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t p-5">
              <button
                type="button"
                onClick={onClose}
                disabled={salvando}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={salvando}
                className="rounded-lg bg-[#EA2E52] px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {salvando
                  ? "Salvando..."
                  : produto
                    ? "Salvar alterações"
                    : "Cadastrar produto"}
              </button>
            </div>
          </form>
        )}

        {/* Formulário de entrada de estoque */}
        {aba === "entrada" && (
          <form onSubmit={handleEntrada}>
            <div className="space-y-4 p-5">
              {produtos.length === 0 ? (
                <p className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
                  Nenhum produto cadastrado. Cadastre um produto antes de
                  registrar uma entrada de estoque.
                </p>
              ) : (
                <>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Selecione o produto *
                    </label>

                    <select
                      value={produtoEntrada}
                      onChange={(e) => setProdutoEntrada(e.target.value)}
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#EA2E52]"
                    >
                      <option value="">Selecione um produto</option>

                      {produtos.map((item) => (
                        <option
                          key={item.id_produto}
                          value={item.id_produto}
                        >
                          {item.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {produtoSelecionado && (
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <p className="text-sm text-gray-500">
                        Estoque atual
                      </p>

                      <p className="text-2xl font-semibold text-[#474646]">
                        {estoqueAtual} unidades
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Quantidade a adicionar *
                    </label>

                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={quantidadeEntrada}
                      onChange={(e) =>
                        setQuantidadeEntrada(e.target.value)
                      }
                      required
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-[#EA2E52]"
                      placeholder="Ex.: 10"
                    />
                  </div>

                  {produtoSelecionado && novaQuantidade > 0 && (
                    <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                      <p className="text-sm text-green-700">
                        Novo estoque após a entrada
                      </p>

                      <p className="text-2xl font-bold text-green-700">
                        {estoqueFinal} unidades
                      </p>
                    </div>
                  )}
                </>
              )}

              {erro && (
                <p
                  role="alert"
                  className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
                >
                  {erro}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t p-5">
              <button
                type="button"
                onClick={onClose}
                disabled={salvando}
                className="rounded-lg border border-gray-300 px-4 py-2 hover:bg-gray-100 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={salvando || produtos.length === 0}
                className="rounded-lg bg-[#EA2E52] px-4 py-2 text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {salvando ? "Registrando..." : "Registrar entrada"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}