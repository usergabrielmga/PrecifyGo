const ProdutoModel = require("../models/produtos.model");

class ProdutoController {

  static async listar(request, reply) {
    try {
      const produtos = await ProdutoModel.listar();

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
      const { id } = request.params;

      const produto = await ProdutoModel.buscarPorId(id);

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

      if (Number(preco) < 0) {
        return reply.code(400).send({
          error: "O preço não pode ser negativo"
        });
      }

      if (Number(estoque) < 0) {
        return reply.code(400).send({
          error: "O estoque não pode ser negativo"
        });
      }

      const produto = await ProdutoModel.criar({
        nome,
        descricao,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: ativo !== undefined ? ativo : true
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
      const { id } = request.params;

      const produtoExistente = await ProdutoModel.buscarPorId(id);

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

      if (Number(preco) < 0) {
        return reply.code(400).send({
          error: "O preço não pode ser negativo"
        });
      }

      if (Number(estoque) < 0) {
        return reply.code(400).send({
          error: "O estoque não pode ser negativo"
        });
      }

      const produto = await ProdutoModel.atualizar(id, {
        nome,
        descricao,
        preco: Number(preco),
        estoque: Number(estoque),
        ativo: ativo !== undefined ? ativo : true
      });

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
      const { id } = request.params;

      const produto = await ProdutoModel.excluir(id);

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

  // Registrar entrada de estoque
  static async registrarEntradaEstoque(request, reply) {
    try {
      const { id } = request.params;
      const { quantidade } = request.body;

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
        Number(quantidade)
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