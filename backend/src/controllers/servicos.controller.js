const ServicoModel = require("../models/servicos.model");

class ServicoController {

  static obterUsuarioId(request) {
    const usuarioId = Number(request.user?.id);

    if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
      return null;
    }

    return usuarioId;
  }

  static async listar(request, reply) {
    try {
      const usuarioId = this.obterUsuarioId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const servicos = await ServicoModel.listar(usuarioId);

      return reply.send(servicos);

    } catch (error) {
      console.error("Erro ao listar serviços:", error);

      return reply.code(500).send({
        error: "Erro ao listar serviços"
      });
    }
  }

  static async buscarPorId(request, reply) {
    try {
      const usuarioId = this.obterUsuarioId(request);
      const { id } = request.params;

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const servico = await ServicoModel.buscarPorId(id, usuarioId);

      if (!servico) {
        return reply.code(404).send({
          error: "Serviço não encontrado"
        });
      }

      return reply.send(servico);

    } catch (error) {
      console.error("Erro ao buscar serviço:", error);

      return reply.code(500).send({
        error: "Erro ao buscar serviço"
      });
    }
  }

  static async criar(request, reply) {
    try {
      const usuarioId = this.obterUsuarioId(request);

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const {
        nome,
        descricao,
        preco,
        ativo
      } = request.body;

      if (!nome || preco === undefined) {
        return reply.code(400).send({
          error: "Nome e preço são obrigatórios"
        });
      }

      if (
        !Number.isFinite(Number(preco)) ||
        Number(preco) < 0
      ) {
        return reply.code(400).send({
          error: "O preço deve ser um número válido e não negativo"
        });
      }

      const servico = await ServicoModel.criar({
        nome,
        descricao,
        preco: Number(preco),
        ativo: ativo !== undefined ? ativo : true,
        usuarioId
      });

      return reply.code(201).send(servico);

    } catch (error) {
      console.error("Erro ao criar serviço:", error);

      return reply.code(500).send({
        error: "Erro ao criar serviço"
      });
    }
  }

  static async atualizar(request, reply) {
    try {
      const usuarioId = this.obterUsuarioId(request);
      const { id } = request.params;

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const servicoExistente = await ServicoModel.buscarPorId(
        id,
        usuarioId
      );

      if (!servicoExistente) {
        return reply.code(404).send({
          error: "Serviço não encontrado"
        });
      }

      const {
        nome,
        descricao,
        preco,
        ativo
      } = request.body;

      if (!nome || preco === undefined) {
        return reply.code(400).send({
          error: "Nome e preço são obrigatórios"
        });
      }

      if (
        !Number.isFinite(Number(preco)) ||
        Number(preco) < 0
      ) {
        return reply.code(400).send({
          error: "O preço deve ser um número válido e não negativo"
        });
      }

      const servico = await ServicoModel.atualizar(id, {
        nome,
        descricao,
        preco: Number(preco),
        ativo: ativo !== undefined ? ativo : true,
        usuarioId
      });

      if (!servico) {
        return reply.code(404).send({
          error: "Serviço não encontrado"
        });
      }

      return reply.send(servico);

    } catch (error) {
      console.error("Erro ao atualizar serviço:", error);

      return reply.code(500).send({
        error: "Erro ao atualizar serviço"
      });
    }
  }

  static async excluir(request, reply) {
    try {
      const usuarioId = this.obterUsuarioId(request);
      const { id } = request.params;

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      const servico = await ServicoModel.excluir(id, usuarioId);

      if (!servico) {
        return reply.code(404).send({
          error: "Serviço não encontrado"
        });
      }

      return reply.send({
        message: "Serviço excluído com sucesso",
        servico
      });

    } catch (error) {
      console.error("Erro ao excluir serviço:", error);

      return reply.code(500).send({
        error: "Erro ao excluir serviço"
      });
    }
  }
}

module.exports = ServicoController;