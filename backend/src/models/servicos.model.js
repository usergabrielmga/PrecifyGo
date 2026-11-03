const db = require("../config/database");

class ServicoModel {

  static async listar() {
    const result = await db.query(`
      SELECT
        id_servico,
        nome,
        descricao,
        preco,
        ativo,
        criado_em
      FROM servicos
      ORDER BY id_servico DESC
    `);

    return result.rows;
  }

  static async buscarPorId(id) {
    const result = await db.query(
      `
      SELECT
        id_servico,
        nome,
        descricao,
        preco,
        ativo,
        criado_em
      FROM servicos
      WHERE id_servico = $1
      `,
      [id]
    );

    return result.rows[0];
  }

  static async criar({ nome, descricao, preco, ativo = true }) {
    const result = await db.query(
      `
      INSERT INTO servicos (
        nome,
        descricao,
        preco,
        ativo
      )
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
      [
        nome,
        descricao || null,
        preco,
        ativo
      ]
    );

    return result.rows[0];
  }

  static async atualizar(
    id,
    { nome, descricao, preco, ativo }
  ) {
    const result = await db.query(
      `
      UPDATE servicos
      SET
        nome = $1,
        descricao = $2,
        preco = $3,
        ativo = $4
      WHERE id_servico = $5
      RETURNING *
      `,
      [
        nome,
        descricao || null,
        preco,
        ativo,
        id
      ]
    );

    return result.rows[0];
  }

  static async excluir(id) {
    const result = await db.query(
      `
      DELETE FROM servicos
      WHERE id_servico = $1
      RETURNING *
      `,
      [id]
    );

    return result.rows[0];
  }
}

module.exports = ServicoModel;