const db = require('../config/database')
const DashboardService = require('../services/dashboard.service')

class DashboardController {
  static async getMetrics(req, res) {
    try {
      const usuarioId = req.user.id;

      const data = await DashboardService.getMetrics(usuarioId)

      return res.status(200).json(data)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: error.message || 'Erro ao buscar dados do dashboard'
      })
    }
  }
}

module.exports = DashboardController