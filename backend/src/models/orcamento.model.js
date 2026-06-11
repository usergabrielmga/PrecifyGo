class OrcamentoModel {
  static async create(data, conn, usuarioId) {

    const normalize = v =>
      v === undefined || v === '' ? null : v

    const result = await conn.query(
      `
      INSERT INTO dados_orcamento (
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
        emissor_id_emissor,
        cliente_id_cliente,
        usuario_id
      )
      VALUES (
        $1, $2, $3, $4, $5, $6,
        NOW(),
        'Pendente',
        $7, $8, $9, $10, $11
      )
      RETURNING numero_orcamento
      `,
      [
        normalize(data.formaPagamento),
        normalize(data.motivoDesconto),
        Number(data.desconto) || 0,
        normalize(data.motivoAcrescimo),
        Number(data.acrescimo) || 0,
        normalize(data.dataValidade),
        normalize(data.observacoes),
        data.tokenPublico,
        data.Emissor_Id_emissor,
        data.Cliente_Id_cliente,
        usuarioId
      ]
    )

    console.log('ROWS:', result.rows)
    return result.rows[0].numero_orcamento
  }

  static async findById(numeroOrcamento, conn) {

    const result = await conn.query(
      `
      SELECT
        id_itens_orcamento,
        produto_servico,
        quantidade,
        valor_unitario,
        (quantidade * valor_unitario) AS total_item
      FROM itens_orcamento
      WHERE dados_orcamento_numero_orcamento = $1
      `,
      [numeroOrcamento]
    )

    return result.rows
  }

  static async findAllForModal(conn, usuarioId) {

    const result = await conn.query(
      `
      SELECT
        o.numero_orcamento,
        o.status,
        o.data_emissao,
        o.validade,
        o.token_publico,
        c.nome AS cliente,
        SUM(i.quantidade * i.valor_unitario) AS total
      FROM dados_orcamento o
      JOIN cliente c
        ON c.id_cliente = o.cliente_id_cliente
      JOIN itens_orcamento i
        ON i.dados_orcamento_numero_orcamento = o.numero_orcamento
      WHERE o.usuario_id = $1
      GROUP BY o.numero_orcamento, c.nome
      ORDER BY o.numero_orcamento DESC
      `,
      [usuarioId]
    )

    return result.rows
  }

  static async findCompleteById(numeroOrcamento, conn) {

    const budgetResult = await conn.query(
      `
      SELECT
        o.numero_orcamento AS numero_orcamento,
        o.forma_pagamento,
        o.desconto,
        o.acrescimo,
        o.validade,
        o.token_publico,
        o.data_emissao,
        o.status,
        o.observacoes,

        e.nome AS emissor_nome,
        e.email AS emissor_email,
        e.telefone AS emissor_telefone,

        c.nome AS cliente_nome,
        c.email AS cliente_email,
        c.telefone AS cliente_telefone,

        e.logotipo AS emissor_logo

      FROM dados_orcamento o
      JOIN emissor e
        ON e.id_emissor = o.emissor_id_emissor
      JOIN cliente c
        ON c.id_cliente = o.cliente_id_cliente
      WHERE o.numero_orcamento = $1
      `,
      [numeroOrcamento]
    )

    const budget = budgetResult.rows[0]

    if (!budget) return null

    const itemsResult = await conn.query(
      `
      SELECT
        produto_servico,
        quantidade,
        valor_unitario,
        (quantidade * valor_unitario) AS total_item
      FROM itens_orcamento
      WHERE dados_orcamento_numero_orcamento = $1
      `,
      [numeroOrcamento]
    )

    const items = itemsResult.rows

    const total = items.reduce(
      (sum, i) => sum + Number(i.total_item),
      0
    )

    return {
      budget,
      items,
      total
    }
  }
}

module.exports = OrcamentoModel