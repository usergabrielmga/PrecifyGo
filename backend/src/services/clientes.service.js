const db = require('../config/database')
const { Pool } = require('pg')
const ClienteModel = require('../models/cliente.model')

class ClientesService {
  static async createCliente(data, usuarioId) {
  if (!data.nome || !data.email || !data.telefone) {
    throw new Error("Campos obrigatórios não preenchidos")
  }

  const conn = await db.connect()

  try {
    const clienteId = await ClienteModel.create(
      {
        nome: data.nome,
        email: data.email,
        telefone: data.telefone,
        endereco: data.endereco ?? null,
        cpf_cnpj: data.cpf_cnpj ?? null,
      },
      conn,
      usuarioId
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



  static async getAll(usuarioId) {
    const conn = await db.connect()
    try {
      return await ClienteModel.getAll(conn , usuarioId)
    } finally {
      conn.release()
    }
  }

  static async edit(id, data, usuarioId) {
    const conn = await db.connect()
    try {
      await ClienteModel.edit(id, data, conn, usuarioId)
    } finally {
      conn.release()
    }
  }



  static async delete(id, usuarioId) {
  const conn = await db.connect()
  try {
    return await ClienteModel.delete(id, conn, usuarioId);
  } finally {
    conn.release();
  }
}
}

module.exports = ClientesService
