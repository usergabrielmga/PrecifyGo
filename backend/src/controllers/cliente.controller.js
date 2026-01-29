const ClientesService = require('../services/clientes.service')

class ClienteController {
  static async create(req, res) {
    try {
      const result = await ClientesService.create(req.body)
      return res.status(201).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getAll(req, res) {
    try {
      const result = await ClientesService.getAll()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  
  static async edit(req, res) {
  try {
    const { id } = req.params
    const data = req.body

    if (!data || Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'Nenhum dado enviado para atualização' })
    }

    await ClientesService.edit(id, data)
    return res.status(200).json({ message: 'Cliente atualizado com sucesso' })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
    }

  

  static async delete(req, res) {
    try {
      const { id } = req.params
      await ClientesService.delete(id)
      return res.status(204).send()
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }
}

module.exports = ClienteController
