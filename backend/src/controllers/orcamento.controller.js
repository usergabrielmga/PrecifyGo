const OrcamentoService = require('../services/orcamento.service')

class OrcamentoController {
  static async create(req, res) {
    try {
      const result = await OrcamentoService.create(req.body)
      return res.status(201).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async getAll (res) {
    try {
      const result = await OrcamentoService.getAll()
      return res.status(200).json(result)
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  }

  static async delete(req, res) {
  try {
    const { id } = req.params
    await OrcamentoService.deleteOrcamento(id)
    return res.status(204).send()
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}

}


module.exports = OrcamentoController
