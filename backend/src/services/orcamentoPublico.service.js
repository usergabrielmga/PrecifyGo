
const db = require('../config/database')
const OrcamentoPublicoModel = require('../models/orcamentoPublico.model')
const OrcamentoService = require('./orcamento.service')

class OrcamentoPublicoService {

  static async getByToken(token) {
    const conn = await db.connect()

    try {
      const orcamento = await OrcamentoPublicoModel.findByToken(token, conn)

      if (!orcamento) {
        throw new Error('Orçamento não encontrado')
      }

      return orcamento
    } finally {
      conn.release()
    }
  }

  static async responder(token, status) {
    if (!['Aprovado', 'Rejeitado', 'Cancelado'].includes(status)) {
      throw new Error('Status inválido')
    }

    const conn = await db.connect()
    let orcamento

    try {
      orcamento = await OrcamentoPublicoModel.findByToken(token, conn)
    } finally {
      conn.release()
    }

    if (!orcamento) {
      throw new Error('Orçamento não encontrado')
    }

    if (orcamento.status !== 'Pendente') {
      throw new Error('Orçamento já respondido ou inválido')
    }

    // A aprovação utiliza a mesma lógica de estoque
    // já existente no OrcamentoService.
    if (status === 'Aprovado') {
      await OrcamentoService.updateStatus(
        orcamento.numero_orcamento,
        'Aprovado',
        orcamento.usuario_id
      )

      return true
    }

    // Rejeição e cancelamento continuam utilizando
    // o fluxo público original.
    const updateConn = await db.connect()

    try {
      const updated = await OrcamentoPublicoModel.updateStatus(
        token,
        status,
        updateConn
      )

      if (updated === 0) {
        throw new Error('Orçamento já respondido ou inválido')
      }

      return true
    } finally {
      updateConn.release()
    }
  }

}

module.exports = OrcamentoPublicoService
