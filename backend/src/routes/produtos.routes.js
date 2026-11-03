const ProdutoController = require("../controllers/produtos.controller");

async function produtosRoutes(fastify) {

  fastify.get("/", ProdutoController.listar);

  fastify.get("/:id", ProdutoController.buscarPorId);

  fastify.post("/", ProdutoController.criar);

  fastify.post("/:id/entrada", ProdutoController.registrarEntradaEstoque);

  fastify.put("/:id", ProdutoController.atualizar);

  fastify.delete("/:id", ProdutoController.excluir);

}

module.exports = produtosRoutes;