const OrcamentoController = require('../controllers/orcamento.controller')

async function orcamentoRoutes(fastify) {
  fastify.post('/', OrcamentoController.create)
  fastify.get('/', OrcamentoController.getAll)
  fastify.delete('/:id', OrcamentoController.delete)
}

module.exports = orcamentoRoutes
