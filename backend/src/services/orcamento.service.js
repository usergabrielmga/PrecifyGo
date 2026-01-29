const db = require('../config/database')
const ClienteModel = require('../models/cliente.model')
const OrcamentoModel = require('../models/orcamento.model')
const ItemModel = require('../models/item.model')
const EmissorModel = require('../models/emissor.model')

class OrcamentoService {
  static async create(data) {
    const { emissor, cliente, orcamento, itens } = data
    const conn = await db.getConnection()

    try {
      await conn.beginTransaction()

      
      let emissorId = orcamento.Emissor_Id_emissor

      if (emissor) {
        const existente = await EmissorModel.findByCpfCnpj(emissor.cpf_cnpj, conn)
        emissorId = existente
          ? existente.Id_emissor
          : await EmissorModel.create(emissor, conn)
      }

      
      const clienteId = await ClienteModel.create(cliente, conn)

      
      const numeroOrcamento = await OrcamentoModel.create(
        {
          ...orcamento,
          Emissor_Id_emissor: emissorId,
          Cliente_Id_cliente: clienteId
        },
        conn
      )

      
      for (const item of itens) {
        await ItemModel.create(numeroOrcamento, item, conn)
      }

      await conn.commit()
      return { Numero_Orcamento: numeroOrcamento }

    } catch (e) {
      await conn.rollback()
      throw e
    } finally {
      conn.release()
    }
  }

 
  static async getAll() {
    const conn = await db.getConnection()
    try {
      return await OrcamentoModel.getAll(conn)
    } finally {
      conn.release()
    }
  }

  static async deleteOrcamento(id) {
    const conn = await db.getConnection()

    try {
      return await OrcamentoModel.deleteOrcamento(id, conn)
    } finally {
      conn.release()
    }
  }


}

module.exports = OrcamentoService