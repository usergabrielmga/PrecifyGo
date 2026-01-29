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

}

module.exports = routes
