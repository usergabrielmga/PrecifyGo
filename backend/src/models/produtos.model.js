const db = require("../config/database");

class ProdutoModel {
  static async listar() {
    const result = await db.query(`
      SELECT
        id_produto,
        nome,
        descricao,
        preco,
        estoque,
        ativo,
        criado_em
      FROM produtos
      ORDER BY id_produto DESC
    `);

    return result.rows;
  }

  static async buscarPorId(id) {
    const result = await db.query(
      `
      SELECT
        id_produto,
        nome,
        descricao,
        preco,
        estoque,
        ativo,
        criado_em
      FROM produtos
      WHERE id_produto = $1
      `,
      [id]
    );

    return result.rows[0];
  }

  static async criar({ nome, descricao, preco, estoque, ativo = true }) {
    const result = await db.query(
      `
      INSERT INTO produtos (
        nome,
        descricao,
        preco,
        estoque,
        ativo
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
      `,
      [
        nome,
        descricao || null,
        preco,
        estoque,
        ativo
      ]
    );

    return result.rows[0];
  }

  static async atualizar(
    id,
    { nome, descricao, preco, estoque, ativo }
  ) {
    const result = await db.query(
      `
      UPDATE produtos
      SET
        nome = $1,
        descricao = $2,
        preco = $3,
        estoque = $4,
        ativo = $5
      WHERE id_produto = $6
      RETURNING *
      `,
      [
        nome,
        descricao || null,
        preco,
        estoque,
        ativo,
        id
      ]
    );

    return result.rows[0];
  }

  static async excluir(id) {
    const result = await db.query(
      `
      DELETE FROM produtos
      WHERE id_produto = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  }

  // Registrar entrada de estoque
  static async registrarEntradaEstoque(id, quantidade) {
    const client = await db.connect();

    try {
      await client.query("BEGIN");

      const produtoResult = await client.query(
        `
        SELECT id_produto, estoque
        FROM produtos
        WHERE id_produto = $1
        FOR UPDATE
        `,
        [id]
      );

      if (produtoResult.rows.length === 0) {
        throw new Error("Produto não encontrado");
      }

      const produtoAtualizado = await client.query(
        `
        UPDATE produtos
        SET estoque = estoque + $1
        WHERE id_produto = $2
        RETURNING *
        `,
        [quantidade, id]
      );

      await client.query(
        `
        INSERT INTO movimentacoes_estoque (
          produto_id,
          tipo,
          quantidade,
          observacao
        )
        VALUES ($1, 'ENTRADA', $2, $3)
        `,
        [
          id,
          quantidade,
          "Entrada manual de estoque"
        ]
      );

      await client.query("COMMIT");

      return produtoAtualizado.rows[0];

    } catch (error) {
      await client.query("ROLLBACK");
      throw error;

    } finally {
      client.release();
    }
  }
}

module.exports = ProdutoModel;