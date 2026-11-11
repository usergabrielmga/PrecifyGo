const db = require("../config/database");

class ProdutoModel {

  static async listar(usuarioId) {
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
      WHERE usuario_id = $1
      ORDER BY id_produto DESC
    `, [usuarioId]);

    return result.rows;
  }

  static async buscarPorId(id, usuarioId) {
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
      AND usuario_id = $2
      `,
      [id, usuarioId]
    );

    return result.rows[0];
  }

  static async criar({
    nome,
    descricao,
    preco,
    estoque,
    ativo = true,
    usuarioId
  }) {
    const result = await db.query(
      `
      INSERT INTO produtos (
        nome,
        descricao,
        preco,
        estoque,
        ativo,
        usuario_id
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [
        nome,
        descricao || null,
        preco,
        estoque,
        ativo,
        usuarioId
      ]
    );

    return result.rows[0];
  }

  static async atualizar(
    id,
    {
      nome,
      descricao,
      preco,
      estoque,
      ativo,
      usuarioId
    }
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
      AND usuario_id = $7
      RETURNING *
      `,
      [
        nome,
        descricao || null,
        preco,
        estoque,
        ativo,
        id,
        usuarioId
      ]
    );

    return result.rows[0];
  }

  static async excluir(id, usuarioId) {
    const result = await db.query(
      `
      DELETE FROM produtos
      WHERE id_produto = $1
      AND usuario_id = $2
      RETURNING *
      `,
      [id, usuarioId]
    );

    return result.rows[0];
  }

  
static async registrarEntradaEstoque(
  id,
  quantidade,
  usuarioId
) {
  const client = await db.connect();

  try {
    await client.query("BEGIN");

    const produtoResult = await client.query(
      `
      SELECT id_produto, estoque
      FROM produtos
      WHERE id_produto = $1
      AND usuario_id = $2
      FOR UPDATE
      `,
      [id, usuarioId]
    );

    if (produtoResult.rows.length === 0) {
      throw new Error("Produto não encontrado");
    }

    const produtoAtualizado = await client.query(
      `
      UPDATE produtos
      SET estoque = estoque + $1
      WHERE id_produto = $2
      AND usuario_id = $3
      RETURNING *
      `,
      [quantidade, id, usuarioId]
    );

    await client.query(
      `
      INSERT INTO movimentacoes_estoque (
        produto_id,
        tipo,
        quantidade,
        observacao,
        usuario_id
      )
      VALUES ($1, 'ENTRADA', $2, $3, $4)
      `,
      [
        id,
        quantidade,
        "Entrada manual de estoque",
        usuarioId
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