class ItemModel {
  static async create(numeroOrcamento, item, conn) {
    const {
      produto_servico,
      quantidade,
      valor_unitario
    } = item

    await conn.query(
      `
      INSERT INTO itens_orcamento (
        produto_servico,
        quantidade,
        valor_unitario,
        dados_orcamento_numero_orcamento
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        produto_servico,
        quantidade,
        valor_unitario,
        numeroOrcamento
      ]
    )
  }
}

module.exports = ItemModel