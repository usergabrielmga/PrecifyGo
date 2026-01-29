const ClienteController = require('../controllers/cliente.controller')

async function clientesRoutes(fastify) {
    fastify.post('/', ClienteController.create)
    fastify.get('/', ClienteController.getAll)
    fastify.put('/:id', ClienteController.edit)
    fastify.delete('/:id', ClienteController.delete)
}

module.exports = clientesRoutes