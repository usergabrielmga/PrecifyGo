class ClienteModel {
  static async create(data, conn, userId) {
    const { nome, email, telefone, endereco, cpf_cnpj } = data

    const [result] = await conn.execute(
      `
      INSERT INTO cliente (
        nome, email, telefone, endereco, cpf_cnpj, user_id
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [nome, email, telefone, endereco, cpf_cnpj, userId]
    )

    return result.insertId
  }

  static async getAll(conn, userId) {
    const [rows] = await conn.execute(
      `
      SELECT * FROM cliente
      WHERE user_id = ?
      `,
      [userId]
    )

    return rows
  }

  static async findByCpfCnpj(cpf_cnpj, conn, userId) {
    const [rows] = await conn.execute(
      `
      SELECT Id_cliente 
      FROM cliente 
      WHERE cpf_cnpj = ? AND user_id = ?
      `,
      [cpf_cnpj, userId]
    )

    return rows[0]?.Id_cliente || null
  }

  static async edit(id, data, conn, userId) {
    const fields = []
    const values = []

    const allowed = ['nome', 'email', 'telefone', 'endereco', 'cpf_cnpj']

    for (const field of allowed) {
      if (data[field] !== undefined) {
        fields.push(`${field} = ?`)
        values.push(data[field])
      }
    }

    values.push(id, userId)

    await conn.execute(
      `
      UPDATE cliente
      SET ${fields.join(', ')}
      WHERE Id_cliente = ? AND user_id = ?
      `,
      values
    )
  }

  static async delete(id, conn, userId) {
    await conn.execute(
      `
      DELETE FROM cliente 
      WHERE Id_cliente = ? AND user_id = ?
      `,
      [id, userId]
    )
  }
}

module.exports = ClienteModel