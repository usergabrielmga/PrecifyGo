class ItemModel {
  static async create(numeroOrcamento, item, conn) {
    const { produto_servico, quantidade, valor_unitario } = item

    await conn.execute(
      `
      INSERT INTO Itens_Orcamento (
        produto_servico,
        quantidade,
        valor_unitario,
        Dados_Orcamento_Numero_Orcamento
      ) VALUES (?, ?, ?, ?)
      `,
      [produto_servico, quantidade, valor_unitario, numeroOrcamento]
    )
  }
}

module.exports = ItemModel
