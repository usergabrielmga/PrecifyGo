import { useEffect, useState, type ChangeEvent } from "react";
import {
  useForm,
  useFieldArray,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { orcamentoSchema } from "../../schemas/orcamento.schema";
import type { OrcamentoFormData } from "../../schemas/orcamento.schema";

import { createOrcamento } from "../../services/orcamentoService";
import { PdfSuccessModal } from "../../models/pdfSuccessModal";
import { uploadLogo } from "../../services/logoService";
import { useNotification } from "../../context/useNotification";
import ProdutoModal from "../../models/ProdutoModal";
import ServicoModal from "../../models/ServicoModal";
import ClienteSelectedModal, { type Cliente } from "../../models/ClienteSelectedModal";
import { getClientes } from "../../services/clienteService";



type PdfSuccessState = {
  open: boolean;
  orcamentoId?: number;
};

type Produto = {
  id_produto: number;
  nome: string;
  descricao?: string;
  preco: number;
  estoque: number;
  ativo: boolean;
};

type Servico = {
  id_servico: number;
  nome: string;
  descricao?: string;
  preco: number;
  ativo: boolean;
};

const backend = "https://precify-go-3tri.vercel.app";

export default function Orcamento() {
  const [pdfSuccess, setPdfSuccess] =
    useState<PdfSuccessState>({
      open: false,
    });

  const [logo, setLogo] =
    useState<File | null>(null);

  const [produtos, setProdutos] =
    useState<Produto[]>([]);

  const [servicos, setServicos] =
    useState<Servico[]>([]);

  const [clientes, setClientes] =
    useState<Cliente[]>([]);

  const [produtoModal, setProdutoModal] =
    useState(false);

  const [servicoModal, setServicoModal] =
    useState(false);

  const [clienteModal, setClienteModal] =
    useState(false);

  const { showNotification } =
    useNotification();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrcamentoFormData>({
    resolver: zodResolver(orcamentoSchema),

    defaultValues: {
      itens: [],
    },
  });

  const {
    fields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "itens",
  });

  /*
   * =====================================================
   * CARREGAR PRODUTOS E SERVIÇOS
   * =====================================================
   */

  useEffect(() => {
    async function carregarProdutosEServicos() {
      try {
        const token =
          localStorage.getItem("token");

        const [
          produtosResponse,
          servicosResponse,
        ] = await Promise.all([
          fetch(`${backend}/produtos`, {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }),

          fetch(`${backend}/servicos`, {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }),
        ]);

        if (!produtosResponse.ok) {
          throw new Error(
            "Erro ao buscar produtos"
          );
        }

        if (!servicosResponse.ok) {
          throw new Error(
            "Erro ao buscar serviços"
          );
        }

        const produtosData =
          await produtosResponse.json();

        const servicosData =
          await servicosResponse.json();

        setProdutos(produtosData);
        setServicos(servicosData);

      } catch (error) {
        console.error(
          "Erro ao carregar produtos e serviços:",
          error
        );
      }
    }

    async function carregarClientes() {
      try {
        const clientesData = await getClientes();
        setClientes(clientesData);
      } catch (error) {
        console.error("Erro ao carregar clientes:", error);
      }
    }

    carregarProdutosEServicos();
    carregarClientes();
  }, []);

  /*
   * =====================================================
   * ABRIR MODAIS
   * =====================================================
   */

  const abrirModalProdutos = () => {
    setProdutoModal(true);
  };

  const abrirModalServicos = () => {
    setServicoModal(true);
  };

  const abrirModalClientes = () => {
    setClienteModal(true);
  };

  const selecionarCliente = (cliente: Cliente) => {
    setValue("nomeClient", cliente.nome, { shouldValidate: true });
    setValue("cpfCnpjClient", cliente.cpf_cnpj, { shouldValidate: true });
    setValue("enderecoClient", cliente.endereco, { shouldValidate: true });
    setValue("telefoneClient", cliente.telefone, { shouldValidate: true });
    setValue("emailClient", cliente.email, { shouldValidate: true });
    setClienteModal(false);
  };

  /*
   * =====================================================
   * ADICIONAR PRODUTO
   * =====================================================
   */

  const adicionarProduto = (
    produto: Produto
  ) => {
    append({
      produtoId:
        produto.id_produto,

      servicoId: null,

      quantidade: 1,

      valorUnitario:
        Number(produto.preco),
    });

    setProdutoModal(false);
  };

  /*
   * =====================================================
   * ADICIONAR SERVIÇO
   * =====================================================
   */

  const adicionarServico = (
    servico: Servico
  ) => {
    append({
      produtoId: null,

      servicoId:
        servico.id_servico,

      quantidade: 1,

      valorUnitario:
        Number(servico.preco),
    });

    setServicoModal(false);
  };

  /*
   * =====================================================
   * LOGO
   * =====================================================
   */

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    if (
      !e.target.files ||
      e.target.files.length === 0
    ) {
      return;
    }

    setLogo(e.target.files[0]);
  };

  /*
   * =====================================================
   * ENVIO
   * =====================================================
   */

  const onSubmit = async (
    data: OrcamentoFormData
  ) => {
    try {
      let logoUrl:
        string | null = null;

      if (logo) {
        const uploadData =
          await uploadLogo(logo);

        logoUrl =
          uploadData.url;
      }

      const response =
        await createOrcamento({
          ...data,
          logo: logoUrl,
        });

      setPdfSuccess({
        open: true,
        orcamentoId:
          response.numero_orcamento ||
          response.id,
      });

    } catch (error) {
      console.error(error);

      showNotification(
        "Erro ao gerar orçamento"
      );
    }
  };

  /*
   * =====================================================
   * TELA
   * =====================================================
   */

  return (
    <div className="max-w-3xl mx-auto">

      {/* =================================================
          TÍTULO
      ================================================= */}

      <div className="flex flex-col items-center gap-2 text-[#474646] mb-10">

        <h1 className="font-bold text-2xl">
          Gerar Orçamento
        </h1>

        <p>
          Gerando o orçamento, será
          disponibilizado para baixar
          PDF ou Imprimir
        </p>

      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >

        {/* =================================================
            DADOS DO EMISSOR
        ================================================= */}

        <section className="border border-[#918E8E] p-4 rounded-lg">

          <h2 className="font-semibold mb-4">
            Dados do Emissor
          </h2>

          <div className="mb-4">

            <label className="text-sm block mb-1">
              Logotipo (opcional)
            </label>

            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleFileChange}
            />

          </div>

          <div className="flex justify-between gap-4 mb-4">

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="text"
                placeholder="Nome"
                {...register("nome")}
              />

              {errors.nome && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nome.message}
                </p>
              )}

            </div>

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="text"
                placeholder="CPF / CNPJ"
                {...register("cpfCnpj")}
              />

              {errors.cpfCnpj && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.cpfCnpj.message}
                </p>
              )}

            </div>

          </div>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Endereço"
            {...register("endereco")}
          />

          {errors.endereco && (
            <p className="text-red-500 text-sm mb-4">
              {errors.endereco.message}
            </p>
          )}

          <div className="flex gap-4">

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="text"
                placeholder="Telefone"
                {...register("telefone")}
              />

              {errors.telefone && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.telefone.message}
                </p>
              )}

            </div>

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="email"
                placeholder="Email"
                {...register("email")}
              />

              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            DADOS DO CLIENTE
        ================================================= */}

        <section className="border border-[#918E8E] p-4 rounded-lg">

          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="font-semibold">
              Dados do Cliente
            </h2>

            <button
              type="button"
              onClick={abrirModalClientes}
              className="border border-blue-600 text-blue-600 rounded px-4 py-2 text-sm font-medium hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              Selecionar cliente
            </button>
          </div>

          <div className="flex gap-4 mb-4">

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="text"
                placeholder="Nome"
                {...register("nomeClient")}
              />

              {errors.nomeClient && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nomeClient.message}
                </p>
              )}

            </div>

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="text"
                placeholder="CPF / CNPJ"
                {...register("cpfCnpjClient")}
              />

              {errors.cpfCnpjClient && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.cpfCnpjClient
                      .message
                  }
                </p>
              )}

            </div>

          </div>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Endereço"
            {...register("enderecoClient")}
          />

          {errors.enderecoClient && (
            <p className="text-red-500 text-sm mb-4">
              {
                errors.enderecoClient
                  .message
              }
            </p>
          )}

          <div className="flex gap-4">

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="text"
                placeholder="Telefone"
                {...register("telefoneClient")}
              />

              {errors.telefoneClient && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.telefoneClient
                      .message
                  }
                </p>
              )}

            </div>

            <div className="w-1/2">

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="email"
                placeholder="Email"
                {...register("emailClient")}
              />

              {errors.emailClient && (
                <p className="text-red-500 text-sm mt-1">
                  {
                    errors.emailClient
                      .message
                  }
                </p>
              )}

            </div>

          </div>

        </section>

        {/* =================================================
            ITENS DO ORÇAMENTO
        ================================================= */}

        <section className="border border-[#918E8E] p-4 rounded-lg">

          <h2 className="font-semibold mb-4">
            Itens do Orçamento
          </h2>

          {/* BOTÕES */}

          <div className="flex gap-3 mb-6">

            <button
              type="button"
              onClick={abrirModalProdutos}
              className="flex-1 border border-blue-600 text-blue-600 rounded px-4 py-3 font-medium hover:bg-blue-600 hover:text-white cursor-pointer"
            >
              + Adicionar item
            </button>

            <button
              type="button"
              onClick={abrirModalServicos}
              className="flex-1 border border-green-600 text-green-600 rounded px-4 py-3 font-medium hover:bg-green-600 hover:text-white cursor-pointer"
            >
              + Adicionar serviço
            </button>

          </div>

          {/* ITENS */}

          {fields.length === 0 && (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center text-gray-500">
              Nenhum item adicionado ao orçamento.
            </div>
          )}

          {fields.length > 0 && (
            <div>

              <h3 className="font-semibold mb-3">
                Itens adicionados
              </h3>

              {fields.map(
                (field, index) => {

                  const quantidade =
                    watch(
                      `itens.${index}.quantidade`
                    ) ?? 0;

                  const valor =
                    watch(
                      `itens.${index}.valorUnitario`
                    ) ?? 0;

                  const produtoId =
                    watch(
                      `itens.${index}.produtoId`
                    );

                  const servicoId =
                    watch(
                      `itens.${index}.servicoId`
                    );

                  const produto =
                    produtos.find(
                      (item) =>
                        item.id_produto ===
                        produtoId
                    );

                  const servico =
                    servicos.find(
                      (item) =>
                        item.id_servico ===
                        servicoId
                    );

                  const total =
                    quantidade * valor;

                  return (
                    <div
                      key={field.id}
                      className="border border-gray-300 rounded-lg p-4 mb-4"
                    >

                      <div className="flex items-start justify-between mb-4">

                        <div>

                          <p className="font-semibold text-lg">
                            {produto?.nome ||
                              servico?.nome ||
                              "Item"}
                          </p>

                          <p className="text-sm text-gray-500">
                            {produto
                              ? "Produto"
                              : "Serviço"}
                          </p>

                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            remove(index)
                          }
                          className="text-sm text-red-600 border border-red-600 rounded px-3 py-1 hover:bg-red-600 hover:text-white cursor-pointer"
                        >
                          Remover
                        </button>

                      </div>

                      <div className="flex gap-4">

                        <div className="w-1/3">

                          <label className="text-sm block mb-1">
                            Quantidade
                          </label>

                          <input
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                            type="number"
                            min="1"
                            {...register(
                              `itens.${index}.quantidade`,
                              {
                                valueAsNumber:
                                  true,
                              }
                            )}
                          />

                          {errors.itens?.[
                            index
                          ]?.quantidade && (
                            <p className="text-red-500 text-sm mt-1">
                              {
                                errors
                                  .itens[
                                  index
                                ]
                                  ?.quantidade
                                  ?.message
                              }
                            </p>
                          )}

                        </div>

                        <div className="w-1/3">

                          <label className="text-sm block mb-1">
                            Valor unitário
                          </label>

                          <input
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                            type="number"
                            min="0.01"
                            step="0.01"
                            {...register(
                              `itens.${index}.valorUnitario`,
                              {
                                valueAsNumber:
                                  true,
                              }
                            )}
                          />

                          {errors.itens?.[
                            index
                          ]?.valorUnitario && (
                            <p className="text-red-500 text-sm mt-1">
                              {
                                errors
                                  .itens[
                                  index
                                ]
                                  ?.valorUnitario
                                  ?.message
                              }
                            </p>
                          )}

                        </div>

                        <div className="w-1/3">

                          <label className="text-sm block mb-1">
                            Total
                          </label>

                          <input
                            className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                            value={total.toFixed(2)}
                            disabled
                          />

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

          {errors.itens?.root && (
            <p className="text-red-500 text-sm mt-2">
              {errors.itens.root.message}
            </p>
          )}

        </section>

        {/* =================================================
            DADOS DO ORÇAMENTO
        ================================================= */}

        <section className="border border-[#918E8E] p-4 rounded-lg">

          <h2 className="font-semibold mb-4">
            Dados do Orçamento
          </h2>

          <div className="flex gap-4 mb-4">

            <div className="w-1/2">

              <label className="text-sm block mb-1">
                Data de emissão
              </label>

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="date"
                {...register("dataEmissao")}
              />

              {errors.dataEmissao && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dataEmissao.message}
                </p>
              )}

            </div>

            <div className="w-1/2">

              <label className="text-sm block mb-1">
                Data de validade
              </label>

              <input
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                type="date"
                {...register("dataValidade")}
              />

              {errors.dataValidade && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dataValidade.message}
                </p>
              )}

            </div>

          </div>

          {/* ACRÉSCIMO */}

          <div className="flex gap-4 mb-4">

            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Acréscimo"
              type="number"
              step="0.01"
              {...register("acrescimo", {
                setValueAs: (v) =>
                  v === ""
                    ? undefined
                    : parseFloat(v),
              })}
            />

            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Motivo do acréscimo"
              {...register(
                "motivoAcrescimo"
              )}
            />

          </div>

          {/* DESCONTO */}

          <div className="flex gap-4 mb-4">

            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Desconto"
              type="number"
              step="0.01"
              {...register("desconto", {
                setValueAs: (v) =>
                  v === ""
                    ? undefined
                    : parseFloat(v),
              })}
            />

            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Motivo do desconto"
              {...register(
                "motivoDesconto"
              )}
            />

          </div>

          {/* FORMA DE PAGAMENTO */}

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
            placeholder="Forma de pagamento"
            {...register(
              "formaPagamento"
            )}
          />

          {errors.formaPagamento && (
            <p className="text-red-500 text-sm mb-4">
              {
                errors.formaPagamento
                  .message
              }
            </p>
          )}

          {/* OBSERVAÇÕES */}

          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
            rows={4}
            placeholder="Observações"
            {...register("observacoes", {
              setValueAs: (v) =>
                v === ""
                  ? undefined
                  : v,
            })}
          />

        </section>

        {/* =================================================
            BOTÃO GERAR
        ================================================= */}

        <button
          type="submit"
          className="w-full bg-[#EA2E52] text-white py-3 rounded-lg font-semibold transition cursor-pointer"
        >
          Gerar Agora
        </button>

      </form>

      {/* =================================================
          MODAIS SEPARADOS
      ================================================= */}

      <ProdutoModal
        open={produtoModal}
        produtos={produtos}
        onClose={() =>
          setProdutoModal(false)
        }
        onSelect={adicionarProduto}
      />

      <ServicoModal
        open={servicoModal}
        servicos={servicos}
        onClose={() =>
          setServicoModal(false)
        }
        onSelect={adicionarServico}
      />

      <ClienteSelectedModal
        open={clienteModal}
        clientes={clientes}
        onClose={() => setClienteModal(false)}
        onSelect={selecionarCliente}
      />

      {/* =================================================
          MODAL DE SUCESSO
      ================================================= */}

      <PdfSuccessModal
        open={pdfSuccess.open}
        orcamentoId={
          pdfSuccess.orcamentoId
        }
        onClose={() =>
          setPdfSuccess({
            open: false,
          })
        }
      />

    </div>
  );
}