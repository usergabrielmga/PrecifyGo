
const db = require("../config/database");

class ServicoModel {

  static async listar(usuarioId) {
    const result = await db.query(`
      SELECT
        id_servico,
        nome,
        descricao,
        preco,
        ativo,
        criado_em
      FROM servicos
      WHERE usuario_id = $1
      ORDER BY id_servico DESC
    `, [usuarioId]);

    return result.rows;
  }

  static async buscarPorId(id, usuarioId) {
    const result = await db.query(`
      SELECT
        id_servico,
        nome,
        descricao,
        preco,
        ativo,
        criado_em
      FROM servicos
      WHERE id_servico = $1
      AND usuario_id = $2
    `, [id, usuarioId]);

    return result.rows[0] || null;
  }

  static async criar({
    nome,
    descricao,
    preco,
    ativo = true,
    usuarioId
  }) {
    const result = await db.query(`
      INSERT INTO servicos (
        nome,
        descricao,
        preco,
        ativo,
        usuario_id
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [
      nome,
      descricao || null,
      preco,
      ativo,
      usuarioId
    ]);

    return result.rows[0];
  }

  static async atualizar(id, {
    nome,
    descricao,
    preco,
    ativo,
    usuarioId
  }) {
    const result = await db.query(`
      UPDATE servicos
      SET
        nome = $1,
        descricao = $2,
        preco = $3,
        ativo = $4
      WHERE id_servico = $5
      AND usuario_id = $6
      RETURNING *
    `, [
      nome,
      descricao || null,
      preco,
      ativo,
      id,
      usuarioId
    ]);

    return result.rows[0] || null;
  }

  static async excluir(id, usuarioId) {
    const result = await db.query(`
      DELETE FROM servicos
      WHERE id_servico = $1
      AND usuario_id = $2
      RETURNING *
    `, [id, usuarioId]);

    return result.rows[0] || null;
  }
}

module.exports = ServicoModel;
