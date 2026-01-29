const db = require('../config/database')
const ClienteModel = require('../models/cliente.model')

class ClientesService {
  static async create(data) {
    const conn = await db.getConnection()
    try {
      const clienteId = await ClienteModel.create(data, conn)
      return { id_cliente: clienteId }
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
    const conn = await db.getConnection()
    try {
      return await ClienteModel.delete(id, conn)
    } finally {
      conn.release()
    }
  }
}

module.exports = ClientesService
