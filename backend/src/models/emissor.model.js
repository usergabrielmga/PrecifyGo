class EmissorModel {
  static async findByCpfCnpj(cpf_cnpj, conn) {
    const [rows] = await conn.execute(
      'SELECT Id_emissor FROM Emissor WHERE cpf_cnpj = ?',
      [cpf_cnpj]
    )
    return rows[0]
  }

  static async create(data, conn) {
    const { nome, email, telefone, endereco, cpf_cnpj, LogoTipo } = data

    const [result] = await conn.execute(
      `
      INSERT INTO Emissor (nome, email, telefone, endereco, cpf_cnpj, LogoTipo)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [nome, email, telefone, endereco, cpf_cnpj, LogoTipo ?? null]
    )

    return result.insertId
  }
}

module.exports = EmissorModel
