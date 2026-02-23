const db = require('../config/database')
const OrcamentoPublicoModel = require('../models/orcamentoPublico.model')

class OrcamentoPublicoService {

  static async getByToken(token) {
    const conn = await db.getConnection()

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
    if (!['Aprovado', 'Rejeitado'].includes(status)) {
      throw new Error('Status inválido')
    }

    const conn = await db.getConnection()

    try {
      const updated = await OrcamentoPublicoModel.updateStatus(
        token,
        status,
        conn
      )

      if (updated === 0) {
        throw new Error('Orçamento já respondido ou inválido')
      }

      return true
    } finally {
      conn.release()
    }
  }

}

module.exports = OrcamentoPublicoService
