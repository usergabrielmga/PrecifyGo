const ClienteController = require('../controllers/cliente.controller')

async function clientesRoutes(fastify) {

  fastify.post(
    '/',
    {
      preHandler: [fastify.authenticate]
    },
    ClienteController.create
  )

  fastify.get(
    '/',
    {
      preHandler: [fastify.authenticate]
    },
    ClienteController.getAll
  )

  fastify.put(
    '/:id',
    {
      preHandler: [fastify.authenticate]
    },
    ClienteController.edit
  )

  fastify.delete(
    '/:id',
    {
      preHandler: [fastify.authenticate]
    },
    ClienteController.delete
  )
}

module.exports = clientesRoutes