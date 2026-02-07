import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray } from "react-hook-form";
import { orcamentoSchema } from "../../schemas/orcamento.schema";
import type { OrcamentoFormData } from "../../schemas/orcamento.schema";
import { createOrcamento } from "../../services/orcamentoService";
import { useState } from "react";
import { PdfSuccessModal } from "../../models/pdfSuccessModal";

type PdfSuccessState = {
  open: boolean;
  orcamentoId?: number;
};

export default function Orcamento() {

  const [pdfSuccess, setPdfSuccess] = useState<PdfSuccessState>({
    open: false,
  });

  const {
  register,
  handleSubmit,
  control,
  watch,
} = useForm<OrcamentoFormData>({
  resolver: zodResolver(orcamentoSchema),
  defaultValues: {
    itens: [
      { produtoServico: "", quantidade: 1, valorUnitario: 0 }
    ]
  }
});

const { fields, append, remove } = useFieldArray({
  control,
  name: "itens",
});


const onSubmit = async (data: OrcamentoFormData) => {
  try {
    const response = await createOrcamento(data);

    // debug
    console.log("Dados enviados:", data);
    console.log("Resposta backend:", response);

    // ajuste o nome conforme o retorno do backend
    const numeroOrcamento = response.Numero_Orcamento || response.id;

    setPdfSuccess({
      open: true,
      orcamentoId: numeroOrcamento,
    });

  } catch (error) {
    console.error("Erro ao gerar orçamento:", error);
    alert("Erro ao gerar orçamento");
  }
};


  return (
    <div className="absolute  left-1/2 -translate-x-1/2 top-30  text-[#474646]">
      <div className="flex flex-col items-center gap-2 text-[#474646] mb-10">
        <h1 className="font-bold text-2xl">Gerar Orçamento</h1>
        <p>
          Gerando o orçamento, será disponibilizado para baixar PDF ou Imprimir
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* ================= Dados do Emissor ================= */}
        <section className="border border-[#918E8E] p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Dados do Emissor</h2>

          <div className="mb-4">
            <label className="text-sm block mb-1">Logotipo (opcional)</label>
            <input type="file" id="logo" />
          </div>

          <div className="flex justify-between gap-4 mb-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="Nome"
              {...register("nome")}
            />
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="CPF / CNPJ"
              {...register("cpfCnpj")}
            />
          </div>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Endereço"
            {...register("endereco")}
          />

          <div className="flex gap-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="Telefone"
              {...register("telefone")}
            />
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
          </div>
        </section>

        {/* ================= Dados do Cliente ================= */}
        <section className="border border-[#918E8E] p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Dados do Cliente</h2>

          <div className="flex gap-4 mb-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="Nome"
              {...register("nomeClient")}
            />
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="CPF / CNPJ"
              {...register("cpfCnpjClient")}
            />
          </div>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Endereço"
            {...register("enderecoClient")}
          />

          <div className="flex gap-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="Telefone"
              {...register("telefoneClient")}
            />
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="email"
              placeholder="Email"
              {...register("emailClient")}
            />
          </div>
        </section>

        {/* ================= Itens do Orçamento ================= */}
        <section className="border border-[#918E8E] p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Itens do Orçamento</h2>

          {fields.map((field, index) => {
            const quantidade = watch(`itens.${index}.quantidade`) ?? 0;
            const valor = watch(`itens.${index}.valorUnitario`) ?? 0;
            const total = quantidade * valor;

            return (
              <div key={field.id} className="mb-6">
                <input
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
                  placeholder="Produto ou serviço"
                  {...register(`itens.${index}.produtoServico`)}
                />

                <div className="flex gap-4 mb-4">
                  <input
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                    type="number"
                    placeholder="Qtd"
                    {...register(`itens.${index}.quantidade`, {
                      valueAsNumber: true,
                    })}
                  />

                  <input
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                    type="number"
                    step="0.01"
                    placeholder="Valor unitário"
                    {...register(`itens.${index}.valorUnitario`, {
                      valueAsNumber: true,
                    })}
                  />

                  <input
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 bg-gray-100"
                    value={total.toFixed(2)}
                    disabled
                  />
                </div>

                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-sm text-red-600 border border-red-600 rounded px-3 py-1 cursor-pointer hover:bg-red-600 hover:text-white"
                >
                  Remover item
                </button>
              </div>
            );
          })}

  <button
    type="button"
    onClick={() =>
      append({ produtoServico: "", quantidade: 1, valorUnitario: 0 })
    }
    className="text-sm text-blue-600 border border-blue-600 rounded px-3 py-1 cursor-pointer hover:bg-blue-600 hover:text-white"
  >
    Adicionar item
  </button>
</section>

        {/* ================= Dados do Orçamento ================= */}
        <section className="border border-[#918E8E] p-4 rounded-lg">
          <h2 className="font-semibold mb-4">Dados do Orçamento</h2>

          <div className="flex gap-4 mb-4">
            <input
              className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Nº Orçamento"
              {...register("numeroOrcamento")}
            />
            <input
              className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="date"
              {...register("dataEmissao")}
            />
            <input
              className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="date"
              {...register("dataValidade")}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Acréscimo"
              type="number"
              step="0.01"
              {...register("acrescimo", { valueAsNumber: true })}
            />
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Motivo do acréscimo"
              {...register("motivoAcrescimo")}
            />
          </div>

          <div className="flex gap-4 mb-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Desconto"
              type="number"
              step="0.01"
              {...register("desconto", { valueAsNumber: true })}
            />
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Motivo do desconto"
              {...register("motivoDesconto")}
            />
          </div>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
            placeholder="Forma de pagamento"
            {...register("formaPagamento")}
          />

          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
            rows={4}
            placeholder="Observações"
            {...register("observacoes")}
          />
        </section>

        <button
          type="submit"
          className="w-full bg-[#EA2E52] text-white py-3 rounded-lg font-semibold transition cursor-pointer"
        >
          Gerar Agora
        </button>
      </form>
      <PdfSuccessModal
        open={pdfSuccess.open}
        orcamentoId={pdfSuccess.orcamentoId}
        onClose={() => setPdfSuccess({ open: false })}
      />
    </div>
  );
}
