
const db = require("../config/database");

class VeiculoModel {

  static async listar(usuarioId, clienteId = null) {
    const result = await db.query(`
      SELECT
        v.id_veiculo,
        v.cliente_id,
        v.usuario_id,
        v.marca,
        v.modelo,
        v.placa,
        v.ano,
        v.cor,
        v.observacoes,
        v.criado_em,
        c.nome AS nome_cliente
      FROM veiculos v
      INNER JOIN cliente c
        ON c.id_cliente = v.cliente_id
       AND c.usuario_id = v.usuario_id
      WHERE v.usuario_id = $1
        AND ($2::integer IS NULL OR v.cliente_id = $2)
      ORDER BY v.id_veiculo DESC
    `, [usuarioId, clienteId]);

    return result.rows;
  }

  static async buscarPorId(id, usuarioId) {
    const result = await db.query(`
      SELECT
        v.*,
        c.nome AS nome_cliente
      FROM veiculos v
      INNER JOIN cliente c
        ON c.id_cliente = v.cliente_id
       AND c.usuario_id = v.usuario_id
      WHERE v.id_veiculo = $1
        AND v.usuario_id = $2
    `, [id, usuarioId]);

    return result.rows[0] || null;
  }

  static async criar({
    clienteId,
    usuarioId,
    marca,
    modelo,
    placa,
    ano,
    cor,
    observacoes
  }) {
    const result = await db.query(`
      INSERT INTO veiculos (
        cliente_id,
        usuario_id,
        marca,
        modelo,
        placa,
        ano,
        cor,
        observacoes
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [
      clienteId,
      usuarioId,
      marca,
      modelo,
      placa,
      ano,
      cor,
      observacoes
    ]);

    return result.rows[0];
  }

  static async atualizar(id, {
    clienteId,
    usuarioId,
    marca,
    modelo,
    placa,
    ano,
    cor,
    observacoes
  }) {
    const result = await db.query(`
      UPDATE veiculos
      SET
        cliente_id = $1,
        marca = $2,
        modelo = $3,
        placa = $4,
        ano = $5,
        cor = $6,
        observacoes = $7
      WHERE id_veiculo = $8
        AND usuario_id = $9
      RETURNING *
    `, [
      clienteId,
      marca,
      modelo,
      placa,
      ano,
      cor,
      observacoes,
      id,
      usuarioId
    ]);

    return result.rows[0] || null;
  }

  static async excluir(id, usuarioId) {
    const result = await db.query(`
      DELETE FROM veiculos
      WHERE id_veiculo = $1
        AND usuario_id = $2
      RETURNING *
    `, [id, usuarioId]);

    return result.rows[0] || null;
  }
}

module.exports = VeiculoModel;
