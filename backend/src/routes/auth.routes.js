const AuthController = require('../controllers/auth.controller')
const backend = import.meta.env.VITE_BACKEND_URL;

async function authRoutes(fastify) {
  fastify.post(`${backend}/register`, AuthController.register)
  fastify.post(`${backend}/login`, AuthController.login)
  fastify.post(`${backend}/google`, AuthController.googleLogin)
}

module.exports = authRoutes
