const db = require('../config/database')

class DashboardService {
  static async getMetrics(usuarioId) {

    try {

      const orcMesResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM dados_orcamento
        WHERE usuario_id = $1
          AND DATE_TRUNC('month', data_emissao)
              = DATE_TRUNC('month', CURRENT_DATE)
        `,
        [usuarioId]
      )

      const orcMes = orcMesResult.rows[0]

      const totalMesResult = await db.query(
        `
        SELECT COALESCE(
          SUM(i.quantidade * i.valor_unitario),
          0
        ) AS total

        FROM dados_orcamento d

        JOIN itens_orcamento i
          ON i.dados_orcamento_numero_orcamento =
             d.numero_orcamento

        WHERE d.usuario_id = $1
          AND d.status = 'Aprovado'
          AND DATE_TRUNC('month', d.data_emissao)
              = DATE_TRUNC('month', CURRENT_DATE)
        `,
        [usuarioId]
      )

      const totalMes = totalMesResult.rows[0]

      const orcTotalResult = await db.query(
        `
        SELECT COUNT(*) AS total
        FROM dados_orcamento
        WHERE usuario_id = $1
        `,
        [usuarioId]
      )

      const orcTotal = orcTotalResult.rows[0]

      const clientesResult = await db.query(
        `
        SELECT COUNT(DISTINCT Cliente_Id_cliente) AS total
        FROM dados_orcamento
        WHERE usuario_id = $1
        `,
        [usuarioId]
      )

      const clientes = clientesResult.rows[0]

      const statusResult = await db.query(
        `
        SELECT status, COUNT(*) AS total
        FROM dados_orcamento
        WHERE usuario_id = $1
        GROUP BY status
        `,
        [usuarioId]
      )

      const statusRows = statusResult.rows

      const status = {
        Enviado: 0,
        Aprovado: 0,
        Cancelado: 0,
        Rejeitado: 0,
        Pendente: 0
      }

      for (const row of statusRows) {
        status[row.status] = Number(row.total)
      }

      return {
        orcamentosMes: Number(orcMes.total),
        totalMes: Number(totalMes.total),
        orcamentosTotal: Number(orcTotal.total),
        clientesTotal: Number(clientes.total),
        status
      }

    } catch (error) {
      console.error('ERRO REAL DASHBOARD:', error)
      throw error
    }
  }
}

module.exports = DashboardService