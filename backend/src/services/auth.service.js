const UserModel = require('../models/user.model')
const bcrypt = require('bcryptjs')

class AuthService {
  async register(data) {
    const { nome, email, senha } = data

    if (!email || !senha) {
      throw new Error('Email e senha obrigatórios')
    }

    const exists = await UserModel.findByEmail(email)
    if (exists) {
      throw new Error('Usuário já existe')
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    await UserModel.createLocal({
      nome,
      email,
      senha: senhaHash
    })

    return { message: 'Usuário registrado com sucesso' }
  }

  async login(data) {
    const { email, senha } = data

    const user = await UserModel.findByEmail(email)
    if (!user) {
      throw new Error('Usuário não encontrado')
    }

    const senhaValida = await bcrypt.compare(senha, user.senha)
    if (!senhaValida) {
      throw new Error('Senha inválida')
    }

    return {
      id: user.id,
      email: user.email
    }
  }
}

module.exports = new AuthService()
