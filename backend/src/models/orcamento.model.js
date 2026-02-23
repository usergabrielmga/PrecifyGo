class OrcamentoModel {
  static async create(data, conn) {
    const normalize = v => (v === undefined ? null : v)

    const payload = {
      forma_pagamento: normalize(data.formaPagamento),
      motivo_desconto: normalize(data.motivoDesconto),
      desconto: Number.isFinite(data.desconto) ? data.desconto : 0,
      motivo_acrescimo: normalize(data.motivoAcrescimo),
      acrescimo: Number.isFinite(data.acrescimo) ? data.acrescimo : 0,
      validade: normalize(data.dataValidade),
      observacoes: normalize(data.observacoes),
      token_publico: data.tokenPublico,
      Emissor_Id_emissor: data.Emissor_Id_emissor,
      Cliente_Id_cliente: data.Cliente_Id_cliente,
    }

   const params = [
    payload.forma_pagamento,
    payload.motivo_desconto,
    payload.desconto,
    payload.motivo_acrescimo,
    payload.acrescimo,
    payload.validade,
    payload.observacoes,
    payload.token_publico, 
    payload.Emissor_Id_emissor,
    payload.Cliente_Id_cliente
  ]

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
    token_publico,
    Emissor_Id_emissor,
    Cliente_Id_cliente
  ) VALUES (?, ?, ?, ?, ?, ?, NOW(), 'Pendente', ?, ?, ?, ?)
  `,
  params
)

    return result.insertId
  }



  static async findById(numeroOrcamento, conn) {
    const [rows] = await conn.execute(
      `
      SELECT 
        IdItens_Orcamento,
        produto_servico,
        quantidade,
        valor_unitario,
        (quantidade * valor_unitario) AS total_item
      FROM Itens_Orcamento
      WHERE Dados_Orcamento_Numero_Orcamento = ?
      `,
      [numeroOrcamento]
    )

    return rows
  }

  static async findAllForModal(conn) {
    const [rows] = await conn.execute(`
      SELECT
        o.Numero_Orcamento,
        o.status,
        o.data_emissao,
        o.validade,
        o.token_publico,
        c.nome AS cliente,
        SUM(i.quantidade * i.valor_unitario) AS total
      FROM Dados_Orcamento o
      JOIN Cliente c ON c.Id_cliente = o.Cliente_Id_cliente
      JOIN Itens_Orcamento i 
        ON i.Dados_Orcamento_Numero_Orcamento = o.Numero_Orcamento
      GROUP BY o.Numero_Orcamento
      ORDER BY o.Numero_Orcamento DESC
    `)

    return rows
  }

  static async findCompleteById(numeroOrcamento, conn) {
  const [[budget]] = await conn.execute(`
    SELECT 
      o.Numero_Orcamento,
      o.forma_pagamento,
      o.desconto,
      o.acrescimo,
      o.validade,
      o.token_publico,
      o.data_emissao,
      o.status,
      o.observacoes,

      e.nome  AS emissor_nome,
      e.email AS emissor_email,
      e.telefone AS emissor_telefone,

      c.nome  AS cliente_nome,
      c.email AS cliente_email,
      c.telefone AS cliente_telefone,
      e.LogoTipo AS emissor_logo

    FROM Dados_Orcamento o
    JOIN Emissor e ON e.Id_emissor = o.Emissor_Id_emissor
    JOIN Cliente c ON c.Id_cliente = o.Cliente_Id_cliente
    WHERE o.Numero_Orcamento = ?
  `, [numeroOrcamento])

  if (!budget) return null

  const [items] = await conn.execute(`
    SELECT 
      produto_servico,
      quantidade,
      valor_unitario,
      (quantidade * valor_unitario) AS total_item
    FROM Itens_Orcamento
    WHERE Dados_Orcamento_Numero_Orcamento = ?
  `, [numeroOrcamento])

  const total = items.reduce((sum, i) => sum + Number(i.total_item), 0)

  return { budget, items, total }
}



}


module.exports = OrcamentoModel
