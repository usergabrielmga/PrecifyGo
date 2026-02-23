import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray } from "react-hook-form";
import { orcamentoSchema } from "../../schemas/orcamento.schema";
import type { OrcamentoFormData } from "../../schemas/orcamento.schema";
import { createOrcamento } from "../../services/orcamentoService";
import { useState } from "react";
import { PdfSuccessModal } from "../../models/pdfSuccessModal";
import { uploadLogo } from "../../services/logoService";

type PdfSuccessState = {
  open: boolean;
  orcamentoId?: number;
};

export default function Orcamento() {

  const [pdfSuccess, setPdfSuccess] = useState<PdfSuccessState>({
    open: false,
  });

  const [logo, setLogo] = useState<File | null>(null);



 const {
  register,
  handleSubmit,
  control,
  watch,
  formState: { errors }
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


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files || e.target.files.length === 0) return;
  setLogo(e.target.files[0]);
};

const onSubmit = async (data: OrcamentoFormData) => {
  try {
    let logoUrl: string | null = null;

    if (logo) {
      // Passa apenas o arquivo para o service
      const uploadData = await uploadLogo(logo);
      logoUrl = uploadData.url; // backend deve retornar { url: "..." }
    }

    // Cria o orçamento passando a URL da logo
    const response = await createOrcamento({ ...data, logo: logoUrl });

    setPdfSuccess({
      open: true,
      orcamentoId: response.Numero_Orcamento || response.id,
    });

  } catch (error) {
    console.error(error);
    alert("Erro ao gerar orçamento");
  }
};


  return (
    <div className="max-w-3xl mx-auto">
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
            <input 
              type="file" 
              id="logo" 
              accept="image/*"
              onChange={handleFileChange}
          />

          </div>

          <div className="flex justify-between gap-4 mb-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="Nome"
              {...register("nome")}
            />
            
            {errors.nome && (
              <p className="text-red-500 text-sm mb-4">
                {errors.nome.message}
              </p>
            )}


            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="CPF / CNPJ"
              {...register("cpfCnpj")}
            />

            
            {errors.cpfCnpj && (
              <p className="text-red-500 text-sm mb-4">
                {errors.cpfCnpj.message}
              </p>
            )}
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
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="Telefone"
              {...register("telefone")}
            />

            
            {errors.telefone && (
              <p className="text-red-500 text-sm mb-4">
                {errors.telefone.message}
              </p>
            )}
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="email"
              placeholder="Email"
              {...register("email")}
            />
            
            {errors.email && (
              <p className="text-red-500 text-sm mb-4">
                {errors.email.message}
              </p>
            )}
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

            
            {errors.nomeClient && (
              <p className="text-red-500 text-sm mb-4">
                {errors.nomeClient.message}
              </p>
            )}
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="CPF / CNPJ"
              {...register("cpfCnpjClient")}
            />
            
            {errors.cpfCnpjClient && (
              <p className="text-red-500 text-sm mb-4">
                {errors.cpfCnpjClient.message}
              </p>
            )}
          </div>

          <input
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2"
            type="text"
            placeholder="Endereço"
            {...register("enderecoClient")}
          />
          
          {errors.enderecoClient && (
            <p className="text-red-500 text-sm mb-4">
              {errors.enderecoClient.message}
            </p>
          )}

          <div className="flex gap-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="text"
              placeholder="Telefone"
              {...register("telefoneClient")}
            />
            
            {errors.telefoneClient && (
              <p className="text-red-500 text-sm mb-4">
                {errors.telefoneClient.message}
              </p>
            )}
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="email"
              placeholder="Email"
              {...register("emailClient")}
            />
            
            {errors.emailClient && (
              <p className="text-red-500 text-sm mb-4">
                {errors.emailClient.message}
              </p>
            )}
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
                
                {errors.itens?.[index]?.produtoServico && (
                  <p className="text-red-500 text-sm mb-4">
                    {errors.itens[index].produtoServico.message}
                  </p>
                )}

                <div className="flex gap-4 mb-4">
                  <input
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                    type="number"
                    placeholder="Qtd"
                    {...register(`itens.${index}.quantidade`, {
                      valueAsNumber: true,
                    })}
                  />
                                    
                  {errors.itens?.[index]?.quantidade && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.itens[index].quantidade.message}
                    </p>
                  )}

                  <input
                    className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
                    type="number"
                    step="0.01"
                    placeholder="Valor unitário"
                    {...register(`itens.${index}.valorUnitario`, {
                      valueAsNumber: true,
                    })}
                  />

                  {errors.itens?.[index]?.valorUnitario && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.itens[index].valorUnitario.message}
                    </p>
                  )}

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
              {errors.numeroOrcamento && ( 
              <p className="text-red-500 text-sm mb-4">
                {errors.numeroOrcamento.message}
              </p>
            )}
            <input
              className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="date"
              {...register("dataEmissao")}
            />
            {errors.dataEmissao && (
              <p className="text-red-500 text-sm mb-4">
                {errors.dataEmissao.message}
              </p>
            )}
            <input
              className="w-1/3 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              type="date"
              {...register("dataValidade")}
            />
            {errors.dataValidade && (
              <p className="text-red-500 text-sm mb-4">
                {errors.dataValidade.message}
              </p>
            )}
          </div>

          <div className="flex gap-4 mb-4">
            <input
              className="w-1/2 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
              placeholder="Acréscimo"
              type="number"
              step="0.01"
              {...register("acrescimo", {
                setValueAs: v => v === "" ? undefined : parseFloat(v)
              })}
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
              {...register("desconto", { 
                setValueAs: v => v === "" ? undefined : parseFloat(v)
               })}
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
          {errors.formaPagamento && (
            <p className="text-red-500 text-sm mb-4">
              {errors.formaPagamento.message}
            </p>
          )}

          <textarea
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2"
            rows={4}
            placeholder="Observações"
            {...register("observacoes", {
              setValueAs: v => v === "" ? undefined : v
            })}
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

