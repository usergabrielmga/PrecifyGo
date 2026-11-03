class ItemModel {
  static async create(numeroOrcamento, item, conn) {
    const {
      produto_id,
      servico_id,
      quantidade,
      valor_unitario
    } = item

    const produtoId = produto_id ?? null
    const servicoId = servico_id ?? null

    // O item precisa ser um produto OU um serviço.
    if ((produtoId === null) === (servicoId === null)) {
      throw new Error(
        'O item deve ser um produto ou um serviço, mas não ambos.'
      )
    }

    await conn.query(
      `
      INSERT INTO itens_orcamento (
        produto_id,
        servico_id,
        quantidade,
        valor_unitario,
        dados_orcamento_numero_orcamento
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        produtoId,
        servicoId,
        quantidade,
        valor_unitario,
        numeroOrcamento
      ]
    )
  }
}

module.exports = ItemModel