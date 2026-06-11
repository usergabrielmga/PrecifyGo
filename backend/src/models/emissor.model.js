class EmissorModel {
  static async create(data, conn) {
    const normalize = v => (v === undefined ? null : v)

    const result = await conn.query(
      `
      INSERT INTO emissor
      (nome, email, telefone, endereco, cpf_cnpj, logotipo)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id_emissor
      `,
      [
        data.nome,
        normalize(data.email),
        normalize(data.telefone),
        normalize(data.endereco),
        data.cpf_cnpj,
        normalize(data.logotipo)
      ]
    )

    return result.rows[0].id_emissor
  }
}

module.exports = EmissorModel