const AuthService = require('../services/auth.service')
const axios = require('axios')
const UserModel = require('../models/user.model')

class AuthController {
  static async register(request, reply) {
    const result = await AuthService.register(request.body)
    return reply.code(201).send(result)
  }

  static async login(request, reply) {
    const user = await AuthService.login(request.body)

    const token = await reply.jwtSign(
      {
        id: user.id,
        email: user.email
      },
      {
        expiresIn: '1d'
      }
    )

    return reply.send({ token })
  }

  static async googleLogin(request, reply) {
    try {
      const { accessToken } = request.body

      if (!accessToken) {
        return reply.code(400).send({ error: 'Access token não enviado' })
      }

    
      const response = await axios.get(
        'https://www.googleapis.com/oauth2/v3/userinfo',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      )

      const { email, name, sub } = response.data

      if (!email || !sub) {
        return reply.code(401).send({ error: 'Token Google inválido' })
      }

     
      let user = await UserModel.findByEmail(email)

      if (!user) {
        const userId = await UserModel.createGoogle({
          nome: name || email.split('@')[0],
          email,
          googleId: sub
        })

        user = { id: userId, email }
      } else if (!user.google_id) {
        await UserModel.linkGoogle(user.id, sub)
      }


      const jwt = await reply.jwtSign(
        { id: user.id, email: user.email },
        { expiresIn: '1d' }
      )

      return reply.send({ token: jwt })

    } catch (error) {
      console.error(error.response?.data || error.message)
      return reply.code(500).send({ error: 'Erro no login com Google' })
    }
  }
}

module.exports = AuthController
