const ClientesService = require('../services/clientes.service')

class ClienteController {
  static async create(request, reply) {
  try {
    const clienteId = await ClientesService.createCliente(request.body)
    return reply.code(201).send({ clienteId })
  } catch (error) {
    return reply.code(400).send({ error: error.message })
  }
}

  static async getAll(request, reply) {
    try {
      const result = await ClientesService.getAll()
      return reply.code(200).send(result)
    } catch (error) {
      return reply.code(400).send({ error: error.message })
    }
  }

  static async edit(request, reply) {
    try {
      const { id } = request.params
      const data = request.body

      if (!data || Object.keys(data).length === 0) {
        return reply
          .code(400)
          .send({ error: 'Nenhum dado enviado para atualização' })
      }

      await ClientesService.edit(id, data)

      return reply.code(200).send({
        message: 'Cliente atualizado com sucesso'
      })
    } catch (error) {
      return reply.code(400).send({ error: error.message })
    }
  }

  static async delete(request, reply) {
  try {
    const { id } = request.params;
    await ClientesService.delete(Number(id));
    return reply.code(204).send();
  } catch (error) {
    if (error.message.includes('foreign key')) {
      return reply.code(409).send({
        error: 'Não é possível excluir o cliente porque ele possui orçamentos vinculados.'
      });
    }

    return reply.code(400).send({ error: error.message });
  }
}

}

module.exports = ClienteController
