class EmissorModel {
  static async create(data, conn) {
    const normalize = v => (v === undefined ? null : v)
    console.log("Payload para o banco:", data, conn);
    const [result] = await conn.execute(
      `
      INSERT INTO Emissor (nome, email, telefone, endereco, cpf_cnpj, LogoTipo)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        data.nome,
        normalize(data.email),
        normalize(data.telefone),
        normalize(data.endereco),
        data.cpf_cnpj,
        normalize(data.LogoTipo)
      ]
    )

    return result.insertId
  }
}

module.exports = EmissorModel
