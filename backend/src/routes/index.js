async function routes(fastify) {

fastify.decorate("authenticate", async function (request, reply) {
  try {
    await request.jwtVerify()
  } catch (err) {
    reply.code(401).send({ error: "Não autorizado" })
  }
})

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
