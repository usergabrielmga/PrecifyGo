const DashboardService = require('../services/dashboard.service')

async function dashboardRoutes(fastify, options) {
  fastify.get('/dashboard', {
    preHandler: [fastify.authenticate]
  }, async (request, reply) => {
    try {
      const usuarioId = request.user.id;
console.log("AUTH HEADER:", request.headers.authorization);
console.log("USER:", request.user);
      const data = await DashboardService.getMetrics(usuarioId)

console.log("HEADERS:", request.headers.authorization);
console.log("USER:", request.user);
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