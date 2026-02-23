const db = require('../config/database')
const ClienteModel = require('../models/cliente.model')

class ClientesService {
  static async createCliente(data) {
  if (!data.nome || !data.email || !data.telefone) {
    throw new Error("Campos obrigatórios não preenchidos")
  }

  const conn = await db.getConnection()

  try {
    const clienteId = await ClienteModel.create(
      {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco ?? null,
        cpf_cnpj: data.cpf_cnpj ?? null,
      },
      conn
    )

    return clienteId
  } catch (err) {
    
    if (err.code === 'ER_DUP_ENTRY') {
      throw new Error('Cliente com esse CPF/CNPJ já existe')
    }
    throw err
  } finally {
    conn.release()
  }
}



  static async getAll() {
    const conn = await db.getConnection()
    try {
      return await ClienteModel.getAll(conn)
    } finally {
      conn.release()
    }
  }

  static async edit(id, data) {
    const conn = await db.getConnection()
    try {
      await ClienteModel.edit(id, data, conn)
    } finally {
      conn.release()
    }
  }

  static async delete(id) {
  const conn = await db.getConnection();
  try {
    return await ClienteModel.delete(id, conn);
  } finally {
    conn.release();
  }
}
}

module.exports = ClientesService
