const ProdutoModel = require("../models/produtos.model");

class ProdutoController {

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

      const produtos = await ProdutoModel.listar(usuarioId);

      return reply.send(produtos);

    } catch (error) {
      console.error("Erro ao listar produtos:", error);

      return reply.code(500).send({
        error: "Erro ao listar produtos"
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

      const produto = await ProdutoModel.buscarPorId(id, usuarioId);

      if (!produto) {
        return reply.code(404).send({
          error: "Produto não encontrado"
        });
      }

      return reply.send(produto);

    } catch (error) {
      console.error("Erro ao buscar produto:", error);

      return reply.code(500).send({
        error: "Erro ao buscar produto"
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
        estoque,
        ativo
      } = request.body;

      if (!nome || preco === undefined || estoque === undefined) {
        return reply.code(400).send({
          error: "Nome, preço e estoque são obrigatórios"
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

      if (
        !Number.isInteger(Number(estoque)) ||
        Number(estoque) < 0
      ) {
        return reply.code(400).send({
          error: "O estoque deve ser um número inteiro não negativo"
        });
      }

      const produto = await ProdutoModel.criar({
        nome,
        descricao,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: ativo !== undefined ? ativo : true,
        usuarioId
      });

      return reply.code(201).send(produto);

    } catch (error) {
      console.error("Erro ao criar produto:", error);

      return reply.code(500).send({
        error: "Erro ao criar produto"
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

      const produtoExistente = await ProdutoModel.buscarPorId(
        id,
        usuarioId
      );

      if (!produtoExistente) {
        return reply.code(404).send({
          error: "Produto não encontrado"
        });
      }

      const {
        nome,
        descricao,
        preco,
        estoque,
        ativo
      } = request.body;

      if (!nome || preco === undefined || estoque === undefined) {
        return reply.code(400).send({
          error: "Nome, preço e estoque são obrigatórios"
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

      if (
        !Number.isInteger(Number(estoque)) ||
        Number(estoque) < 0
      ) {
        return reply.code(400).send({
          error: "O estoque deve ser um número inteiro não negativo"
        });
      }

      const produto = await ProdutoModel.atualizar(id, {
        nome,
        descricao,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: ativo !== undefined ? ativo : true,
        usuarioId
      });

      if (!produto) {
        return reply.code(404).send({
          error: "Produto não encontrado"
        });
      }

      return reply.send(produto);

    } catch (error) {
      console.error("Erro ao atualizar produto:", error);

      return reply.code(500).send({
        error: "Erro ao atualizar produto"
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

      const produto = await ProdutoModel.excluir(id, usuarioId);

      if (!produto) {
        return reply.code(404).send({
          error: "Produto não encontrado"
        });
      }

      return reply.send({
        message: "Produto excluído com sucesso",
        produto
      });

    } catch (error) {
      console.error("Erro ao excluir produto:", error);

      return reply.code(500).send({
        error: "Erro ao excluir produto"
      });
    }
  }

  static async registrarEntradaEstoque(request, reply) {
    try {
      const usuarioId = this.obterUsuarioId(request);
      const { id } = request.params;
      const { quantidade } = request.body;

      if (!usuarioId) {
        return reply.code(401).send({
          error: "Usuário não autenticado"
        });
      }

      if (
        quantidade === undefined ||
        !Number.isInteger(Number(quantidade)) ||
        Number(quantidade) <= 0
      ) {
        return reply.code(400).send({
          error: "A quantidade deve ser um número inteiro maior que zero"
        });
      }

      const produto = await ProdutoModel.registrarEntradaEstoque(
        id,
        Number(quantidade),
        usuarioId
      );

      return reply.send({
        message: "Entrada de estoque registrada com sucesso",
        produto
      });

    } catch (error) {
      if (error.message === "Produto não encontrado") {
        return reply.code(404).send({
          error: error.message
        });
      }

      console.error("Erro ao registrar entrada de estoque:", error);

      return reply.code(500).send({
        error: "Erro ao registrar entrada de estoque"
      });
    }
  }
}

module.exports = ProdutoController;