const AuthController = require('../controllers/auth.controller')

async function authRoutes(fastify) {
  fastify.post('/register', AuthController.register)
  fastify.post('/login', AuthController.login)
  fastify.post('/google', AuthController.googleLogin)
}

module.exports = authRoutes
