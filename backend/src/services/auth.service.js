const UserModel = require('../models/user.model')
const bcrypt = require('bcryptjs')

class AuthService {
  async register(data) {
    const { name, email, password } = data

    if (!email || !password) {
      throw new Error('Email e senha obrigatórios')
    }

    const exists = await UserModel.findByEmail(email)
    if (exists) {
      throw new Error('Usuário já existe')
    }

    const passwordHash = await bcrypt.hash(password, 10)

    await UserModel.createLocal({
      name,
      email,
      password: passwordHash
    })

    return { message: 'Usuário registrado com sucesso' }
  }

  async login(data) {
    const { email, password } = data

    const user = await UserModel.findByEmail(email)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const passwordValid = await bcrypt.compare(password, user.password)
    if (!passwordValid) {
      throw new Error('Senha inválida')
    }

    return {
      id: user.id,
      email: user.email
    }
  }
}

module.exports = new AuthService()
