const db = require('../config/database')

class DashboardService {
  static async getMetrics() {
    const conn = await db.getConnection()

    try {
      /* Orçamentos do mês */
      const [[orcMes]] = await conn.execute(`
        SELECT COUNT(*) AS total
        FROM Dados_Orcamento
        WHERE MONTH(data_emissao) = MONTH(CURRENT_DATE())
          AND YEAR(data_emissao) = YEAR(CURRENT_DATE())
      `)

      /* Total em R$ do mês */
      const [[totalMes]] = await conn.execute(`
        SELECT SUM(i.quantidade * i.valor_unitario) AS total
        FROM Dados_Orcamento d
        JOIN Itens_Orcamento i
          ON i.Dados_Orcamento_Numero_Orcamento = d.Numero_Orcamento
        WHERE MONTH(d.data_emissao) = MONTH(CURRENT_DATE())
          AND YEAR(d.data_emissao) = YEAR(CURRENT_DATE())
      `)

      /* Total de orçamentos */
      const [[orcTotal]] = await conn.execute(`
        SELECT COUNT(*) AS total FROM Dados_Orcamento
      `)

      /* Total de clientes */
      const [[clientes]] = await conn.execute(`
        SELECT COUNT(*) AS total FROM Cliente
      `)

      /* Status */
      const [statusRows] = await conn.execute(`
        SELECT status, COUNT(*) AS total
        FROM Dados_Orcamento
        GROUP BY status
      `)

      const status = {
        Enviado: 0,
        Aprovado: 0,
        Cancelado: 0,
        Rejeitado: 0,
        Pendente: 0
      }

      for (const row of statusRows) {
        status[row.status] = row.total
      }

      return {
        orcamentosMes: orcMes.total,
        totalMes: totalMes.total || 0,
        orcamentosTotal: orcTotal.total,
        clientesTotal: clientes.total,
        status
      }
    } finally {
      conn.release()
    }
  }
}

module.exports = DashboardService
