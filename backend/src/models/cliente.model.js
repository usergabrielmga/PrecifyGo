class ClienteModel {
  static async create(data, conn) {
    const { nome, email, telefone, endereco, cpf_cnpj } = data
    console.log("Payload para o banco:", data, conn);
    const [result] = await conn.execute(
      `
      INSERT INTO Cliente (nome, email, telefone, endereco, cpf_cnpj)
      VALUES (?, ?, ?, ?, ?)
      `,
      [nome, email, telefone, endereco, cpf_cnpj]
    )

    return result.insertId
  }

  static async getAll(conn) {
    const [rows] = await conn.execute('SELECT * FROM Cliente')
    return rows
  }

  static async edit(id, data, conn) {
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

  values.push(id)

  const sql = `
    UPDATE Cliente
    SET ${fields.join(', ')}
    WHERE Id_cliente = ?
  `

  await conn.execute(sql, values)
}


  static async delete(id, conn) {
    await conn.execute('DELETE FROM Cliente WHERE Id_cliente = ?', [id])
  }
  
}

module.exports = ClienteModel
