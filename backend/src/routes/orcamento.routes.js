const OrcamentoController = require('../controllers/orcamento.controller')

async function orcamentoRoutes(fastify) {

  // Criar orçamento - autenticado
  fastify.post('/', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.create)

  // Atualizar status - autenticado
  fastify.patch('/:id/status', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.updateStatus)

  // Download PDF - público, sem autenticação
  fastify.get('/:id/pdf', OrcamentoController.pdf)

  // Visualizar PDF - público, sem autenticação
  fastify.get('/:id/view-pdf', OrcamentoController.viewPdf)

  // Listar orçamentos - autenticado
  fastify.get('/', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.getAll)

  // Buscar orçamento - autenticado
  fastify.get('/:id', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.get)

  // Excluir orçamento - autenticado
  fastify.delete('/:id', {
    preHandler: [fastify.authenticate]
  }, OrcamentoController.delete)
}

module.exports = orcamentoRoutes