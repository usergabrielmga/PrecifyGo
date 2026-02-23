class OrcamentoPublicoModel {

  static async findByToken(token, conn) {
    const [rows] = await conn.execute(
      `
      SELECT
        Numero_Orcamento,
        forma_pagamento,
        validade,
        data_emissao,
        status,
        observacoes
      FROM Dados_Orcamento
      WHERE token_publico = ?
      `,
      [token]
    )

    return rows[0] || null
  }

  static async updateStatus(token, status, conn) {
    const [result] = await conn.execute(
      `
      UPDATE Dados_Orcamento
      SET status = ?, data_resposta = NOW()
      WHERE token_publico = ? AND status = 'Pendente'
      `,
      [status, token]
    )

    return result.affectedRows
  }

}

module.exports = OrcamentoPublicoModel
