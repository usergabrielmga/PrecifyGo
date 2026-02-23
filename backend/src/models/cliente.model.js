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

   static async findByCpfCnpj(cpf_cnpj, conn) {
    if (!cpf_cnpj) return null 
    const [rows] = await conn.execute(
      `SELECT Id_cliente FROM Cliente WHERE cpf_cnpj = ?`,
      [cpf_cnpj]
    )
    if (rows.length > 0) return rows[0].Id_cliente
    return null
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
  const [result] = await conn.execute(
    "DELETE FROM Cliente WHERE Id_cliente = ?",
    [id]
  );

  if (result.affectedRows === 0) {
    throw new Error("Cliente não encontrado");
  }
}
  
}

module.exports = ClienteModel
