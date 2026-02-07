import { z } from "zod";

export const orcamentoSchema = z.object({
  /* ================= Emissor ================= */
  logo: z.any().optional(),

  nome: z.string().min(1, "Nome é obrigatório"),
  cpfCnpj: z.string().min(11, "CPF/CNPJ inválido"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  telefone: z.string().min(8, "Telefone inválido"),
  email: z.string().email("Email inválido"),

  /* ================= Cliente ================= */
  nomeClient: z.string().min(1, "Nome do cliente é obrigatório"),
  cpfCnpjClient: z.string().min(11, "CPF/CNPJ inválido"),
  enderecoClient: z.string().min(1, "Endereço é obrigatório"),
  telefoneClient: z.string().min(8, "Telefone inválido"),
  emailClient: z.string().email("Email inválido"),

  /* ================= Itens ================= */
  itens: z.array(
    z.object({
      produtoServico: z.string().min(1, "Produto obrigatório"),
      quantidade: z.number().positive(),
      valorUnitario: z.number().positive(),
    })
  ).min(1, "Adicione ao menos um item"),

  /* ================= Orçamento ================= */
  numeroOrcamento: z.string().min(1),
  dataEmissao: z.string().min(1),
  dataValidade: z.string().min(1),

  acrescimo: z.number().nonnegative().optional(),
  motivoAcrescimo: z.string().optional(),

  desconto: z.number().nonnegative().optional(),
  motivoDesconto: z.string().optional(),

  formaPagamento: z.string().min(1),
  observacoes: z.string().optional(),
});

export type OrcamentoFormData = z.infer<typeof orcamentoSchema>;
