const DashboardService = require('../services/dashboard.service')

async function dashboardRoutes(fastify, options) {
  fastify.get('/dashboard', async (request, reply) => {
    try {
      const data = await DashboardService.getMetrics()
      return reply.code(200).send(data)
    } catch (error) {
      fastify.log.error(error)
      return reply.code(500).send({
        error: 'Erro ao buscar dados do dashboard'
      })
    }
  })
}

module.exports = dashboardRoutes
