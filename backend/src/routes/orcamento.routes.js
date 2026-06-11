const OrcamentoController = require('../controllers/orcamento.controller')

async function orcamentoRoutes(fastify) {

  fastify.post('/', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.create)

  fastify.get('/:id/pdf', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.pdf)

  fastify.get('/:id/view-pdf', {
  }, OrcamentoController.viewPdf)
  
  fastify.get('/', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.getAll)

  fastify.get('/:id', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.get)

  fastify.delete('/:id', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.delete)
}

module.exports = orcamentoRoutes