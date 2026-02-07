const OrcamentoController = require('../controllers/orcamento.controller')

async function orcamentoRoutes(fastify) {
  fastify.post('/', OrcamentoController.create)
  fastify.get('/:id/pdf', OrcamentoController.pdf)
  fastify.get('/', OrcamentoController.getAll)
  fastify.get('/:id', OrcamentoController.get)
  fastify.delete('/:id', OrcamentoController.delete)
}

module.exports = orcamentoRoutes
