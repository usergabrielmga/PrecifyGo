async function authPlugin(fastify) {
  fastify.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      return reply.code(401).send({ error: "Não autorizado" })
    }
  })
}

module.exports = authPlugin