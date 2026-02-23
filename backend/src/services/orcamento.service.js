const db = require('../config/database')
const ClienteModel = require('../models/cliente.model')
const OrcamentoModel = require('../models/orcamento.model')
const ItemModel = require('../models/item.model')
const EmissorModel = require('../models/emissor.model')
const fs = require('fs')
const path = require('path')
const puppeteer = require('puppeteer')
const crypto = require('crypto')


class OrcamentoService {
  static async create(data) {
    if (!data) throw new Error('Body vazio')

    const conn = await db.getConnection()

    try {
      await conn.beginTransaction()

      /* ================= EMISSOR ================= */
      const emissorData = {
        nome: data.nome,
        cpf_cnpj: data.cpfCnpj,
        endereco: data.endereco ?? null,
        telefone: data.telefone ?? null,
        email: data.email ?? null,
        LogoTipo: data.logo ?? null,
      }

      const emissorId = await EmissorModel.create(emissorData, conn)

      /* ================= CLIENTE ================= */
     const clienteData = {
      nome: data.nomeClient?.trim(),
      cpf_cnpj: data.cpfCnpjClient
        ? String(data.cpfCnpjClient).replace(/\D/g, "")
        : null,
      endereco: data.enderecoClient?.trim() ?? null,
      telefone: data.telefoneClient?.trim(),
      email: data.emailClient?.trim(),
    }

    let clienteId

    try {
      // Tenta criar o cliente
      clienteId = await ClienteModel.create(clienteData, conn)
    } catch (error) {
      // Se for erro de duplicidade, pega o ID existente
      if (error.code === "ER_DUP_ENTRY") {
        const existingId = await ClienteModel.findByCpfCnpj(clienteData.cpf_cnpj, conn)
        if (!existingId) throw new Error("Erro ao recuperar cliente existente")
        clienteId = existingId
      } else {
        throw error
      }
    }

    console.log("Cliente ID final:", clienteId)
      const tokenPublico = crypto.randomBytes(32).toString('hex')


      /* ================= ORÇAMENTO ================= */
      const orcamentoData = {
        formaPagamento: data.formaPagamento ?? null,
        motivoDesconto: data.motivoDesconto ?? null,
        desconto: Number(data.desconto) || 0,
        motivoAcrescimo: data.motivoAcrescimo ?? null,
        acrescimo: Number(data.acrescimo) || 0,
        dataValidade: data.dataValidade ?? null,
        observacoes: data.observacoes ?? null,
        Emissor_Id_emissor: emissorId,
        Cliente_Id_cliente: clienteId,
        tokenPublico
      }

      const numeroOrcamento = await OrcamentoModel.create(orcamentoData, conn)

      /* ================= ITENS ================= */
      if (!Array.isArray(data.itens) || data.itens.length === 0) {
        throw new Error('Orçamento precisa ter ao menos um item')
      }

      for (const item of data.itens) {
        await ItemModel.create(
          numeroOrcamento,
          {
            produto_servico: item.produtoServico,  
            quantidade: Number(item.quantidade) || 1,
            valor_unitario: Number(item.valorUnitario) || 0,
          },
          conn
        )
      }

      await conn.commit()

      return {
        clienteId,
        emissorId,
        numeroOrcamento,
        tokenPublico
      }



    } catch (error) {
      await conn.rollback()
      throw error
    } finally {
      conn.release()
      
    }
  }

  static async getAll() {
    const conn = await db.getConnection()
    try {
      return await OrcamentoModel.findAllForModal(conn)
    } finally {
      conn.release()
    }
  }

  static async getById(id) {
  const conn = await db.getConnection()

  try {
    const data = await OrcamentoModel.findCompleteById(id, conn)

    if (!data) {
      throw new Error('Budget not found')
    }

    return data
  } finally {
    conn.release()
  }
}


  static async generatePdf(id) {
  const { budget, items, total } = await this.getById(id)

  const templatePath = path.join(process.cwd(), 'templates/orcamento.html')
  let html = fs.readFileSync(templatePath, 'utf-8')

  const itemsHtml = items.map(item => {
  const unit = Number(item.valor_unitario)
  const totalItem = Number(item.total_item)

  return `
    <tr>
      <td>${item.produto_servico}</td>
      <td>${item.quantidade}</td>
      <td>R$ ${unit.toFixed(2)}</td>
      <td>R$ ${totalItem.toFixed(2)}</td>
    </tr>
  `
}).join('')

  html = html
    .replace('{{logo}}', budget.emissor_logo || '')
    .replace('{{numero}}', budget.Numero_Orcamento)
    .replace('{{emissor_nome}}', budget.emissor_nome)
    .replace('{{emissor_email}}', budget.emissor_email)
    .replace('{{emissor_telefone}}', budget.emissor_telefone)
    .replace('{{cliente_nome}}', budget.cliente_nome)
    .replace('{{cliente_email}}', budget.cliente_email)
    .replace('{{cliente_telefone}}', budget.cliente_telefone)
    .replace('{{items}}', itemsHtml)
    .replace('{{total}}', total.toFixed(2))

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0' })

  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true
  })

  await browser.close()
  return pdf
}
  
}


module.exports = OrcamentoService
