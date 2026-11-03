const ServicoController = require("../controllers/servicos.controller");

async function servicosRoutes(fastify) {

  fastify.get("/", ServicoController.listar);

  fastify.get("/:id", ServicoController.buscarPorId);

  fastify.post("/", ServicoController.criar);

  fastify.put("/:id", ServicoController.atualizar);

  fastify.delete("/:id", ServicoController.excluir);

}

module.exports = servicosRoutes;