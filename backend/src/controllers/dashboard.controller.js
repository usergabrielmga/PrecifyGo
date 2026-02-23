const db = require('../config/database')
const DashboardService = require('../services/dashboard.service')

class DashboardController {
  static async getMetrics(req, res) {
    const conn = await db.getConnection()

    try {
      const data = await DashboardService.getMetrics(conn)
      return res.status(200).json(data)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        error: 'Erro ao buscar dados do dashboard'
      })
    } finally {
      conn.release()
    }
  }
}

module.exports = DashboardController
