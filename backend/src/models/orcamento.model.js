class OrcamentoModel {
  static async create(data, conn) {
    const payload = {
      forma_pagamento: data.forma_pagamento ?? null,
      motivo_desconto: data.motivo_desconto ?? null,
      desconto: data.desconto ?? 0,
      motivo_acrescimo: data.motivo_acrescimo ?? null,
      acrescimo: data.acrescimo ?? 0,
      validade: data.validade ?? null,
      observacoes: data.observacoes ?? null,
      Emissor_Id_emissor: data.Emissor_Id_emissor,
      Cliente_Id_cliente: data.Cliente_Id_cliente
    }

    if (!payload.Emissor_Id_emissor || !payload.Cliente_Id_cliente) {
      throw new Error('Emissor ou Cliente não informado')
    }

    const [result] = await conn.execute(
      `
      INSERT INTO Dados_Orcamento (
        forma_pagamento,
        motivo_desconto,
        desconto,
        motivo_acrescimo,
        acrescimo,
        validade,
        data_emissao,
        status,
        observacoes,
        Emissor_Id_emissor,
        Cliente_Id_cliente
      ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Pendente', ?, ?, ?)
      `,
      [
        payload.forma_pagamento,
        payload.motivo_desconto,
        payload.desconto,
        payload.motivo_acrescimo,
        payload.acrescimo,
        payload.validade,
        payload.observacoes,
        payload.Emissor_Id_emissor,
        payload.Cliente_Id_cliente
      ]
    )

    return result.insertId
  }

  static async getAll(conn) {
    const [rows] = await conn.execute('SELECT * FROM Dados_Orcamento')
    return rows
  }

  static async deleteOrcamento(id, conn) {
  const [result] = await conn.execute(
    `
    UPDATE Dados_Orcamento
    SET status = 'Cancelado'
    WHERE Numero_Orcamento = ?
    `,
    [id]
  )

  if (result.affectedRows === 0) {
    throw new Error('Orçamento não encontrado')
  }

  return true
}


}

module.exports = OrcamentoModel
