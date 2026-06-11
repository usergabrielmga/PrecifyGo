class ClienteModel {

  static async create(data, conn, usuarioId) {

    const {
      nome,
      email,
      telefone,
      endereco,
      cpf_cnpj
    } = data

    const result = await conn.query(
      `
      INSERT INTO cliente
      (
        nome,
        email,
        telefone,
        endereco,
        cpf_cnpj,
        usuario_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_cliente
      `,
      [
        nome,
        email,
        telefone,
        endereco,
        cpf_cnpj,
        usuarioId
      ]
    )

    return result.rows[0].id_cliente
  }

  static async getAll(conn, usuarioId) {

    const result = await conn.query(
      `
      SELECT *
      FROM cliente
      WHERE usuario_id = $1
      `,
      [usuarioId]
    )

    return result.rows
  }

  static async edit(id, data, conn, usuarioId) {

    const allowedFields = [
      'nome',
      'email',
      'telefone',
      'endereco',
      'cpf_cnpj'
    ]

    const fields = []
    const values = []

    let index = 1

    for (const field of allowedFields) {

      if (data[field] !== undefined) {

        fields.push(`${field} = $${index}`)

        values.push(data[field])

        index++
      }
    }

    if (fields.length === 0) {
      throw new Error('Nenhum campo válido para atualização')
    }

    values.push(id)
    values.push(usuarioId)

    await conn.query(
      `
      UPDATE cliente
      SET ${fields.join(', ')}
      WHERE id_cliente = $${index}
      AND usuario_id = $${index + 1}
      `,
      values
    )
  }

  static async delete(id, conn, usuarioId) {

    const result = await conn.query(
      `
      DELETE FROM cliente
      WHERE id_cliente = $1
      AND usuario_id = $2
      `,
      [id, usuarioId]
    )

    if (result.rowCount === 0) {
      throw new Error('Cliente não encontrado')
    }
  }

  static async findByCpfCnpj(cpf_cnpj, conn, usuarioId) {

    if (!cpf_cnpj) return null

    const result = await conn.query(
      `
      SELECT id_cliente
      FROM cliente
      WHERE cpf_cnpj = $1
      AND usuario_id = $2
      `,
      [cpf_cnpj, usuarioId]
    )

    if (result.rows.length > 0) {
      return result.rows[0].id_cliente
    }

    return null
  }
}

module.exports = ClienteModel