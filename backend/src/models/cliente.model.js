const db = require('../config/database')

class ClienteModel {

  // CREATE
  static async create(data, conn, userId) {
    const { nome, email, telefone, endereco, cpf_cnpj } = data

    const [result] = await conn.execute(
      `
      INSERT INTO cliente (
        nome,
        email,
        telefone,
        endereco,
        cpf_cnpj,
        user_id
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [nome, email, telefone, endereco, cpf_cnpj, userId]
    )

    return result.insertId
  }

  // GET ALL (SÓ DO USUÁRIO)
  static async getAll(conn, userId) {
    const [rows] = await conn.execute(
      `
      SELECT 
        Id_cliente,
        nome,
        email,
        telefone,
        endereco,
        cpf_cnpj
      FROM cliente
      WHERE user_id = ?
      `,
      [userId]
    )

    return rows
  }

  // FIND BY CPF dentro do usuário
  static async findByCpfCnpj(cpf_cnpj, conn, userId) {
    if (!cpf_cnpj) return null

    const [rows] = await conn.execute(
      `
      SELECT Id_cliente 
      FROM cliente 
      WHERE cpf_cnpj = ? AND user_id = ?
      `,
      [cpf_cnpj, userId]
    )

    return rows.length > 0 ? rows[0].Id_cliente : null
  }

  // EDIT
  static async edit(id, data, conn, userId) {
    const allowedFields = [
      'nome',
      'email',
      'telefone',
      'endereco',
      'cpf_cnpj'
    ]

    const fields = []
    const values = []

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`)
        values.push(data[field])
      }
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo válido para atualização')
    }

    values.push(id, userId)

    const sql = `
      UPDATE cliente
      SET ${fields.join(', ')}
      WHERE Id_cliente = ? AND user_id = ?
    `

    await conn.execute(sql, values)
  }

  // DELETE
  static async delete(id, conn, userId) {
    const [result] = await conn.execute(
      `
      DELETE FROM cliente
      WHERE Id_cliente = ? AND user_id = ?
      `,
      [id, userId]
    )

    if (result.affectedRows === 0) {
      throw new Error("Cliente não encontrado ou não pertence ao usuário")
    }
  }
}

module.exports = ClienteModel