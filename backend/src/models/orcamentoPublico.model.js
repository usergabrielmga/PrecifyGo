class OrcamentoPublicoModel {

  static async findByToken(token, conn) {

    const result = await conn.query(
      `
      SELECT
        numero_orcamento,
        forma_pagamento,
        validade,
        data_emissao,
        status,
        observacoes
      FROM dados_orcamento
      WHERE token_publico = $1
      `,
      [token]
    )

    return result.rows[0] || null
  }

  static async updateStatus(token, status, conn) {

    const result = await conn.query(
      `
      UPDATE dados_orcamento
      SET status = $1,
          data_resposta = NOW()
      WHERE token_publico = $2
      AND status = 'Pendente'
      `,
      [status, token]
    )

    return result.rowCount
  }
}

module.exports = OrcamentoPublicoModel