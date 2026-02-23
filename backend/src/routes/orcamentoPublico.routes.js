const OrcamentoPublicoController =
  require('../controllers/orcamentoPublico.controller')

module.exports = async function (fastify) {

  fastify.get(
    '/orcamento/publico/:token',
    OrcamentoPublicoController.getByToken
  )

  fastify.post(
    '/orcamento/publico/:token/responder',
    OrcamentoPublicoController.responder
  )

}
