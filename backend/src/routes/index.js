async function routes(fastify) {



  fastify.register(require('./auth.routes'), {
    prefix: '/auth'
  })

  fastify.register(require('./orcamento.routes'), {
    prefix: '/orcamentos'
  })

  fastify.register(require('./clientes.routes'), {
    prefix: '/clientes'
  })

  fastify.register(require('./dashboard.routes'))

  fastify.register(require('./orcamentoPublico.routes'))

  
  fastify.register(require('./logo.routes'))


}

module.exports = routes
