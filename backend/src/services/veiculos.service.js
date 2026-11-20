
const VeiculoModel = require("../models/veiculo.model");

class VeiculosService {

  static validarDados(data) {
    const {
      cliente_id,
      marca,
      modelo,
      placa,
      ano,
      cor,
      observacoes
    } = data || {};

    const clienteId = Number(cliente_id);

    if (
      !Number.isInteger(clienteId) ||
      clienteId <= 0
    ) {
      throw new Error("Selecione um cliente válido");
    }

    if (
      typeof marca !== "string" ||
      !marca.trim()
    ) {
      throw new Error("A marca é obrigatória");
    }

    if (
      typeof modelo !== "string" ||
      !modelo.trim()
    ) {
      throw new Error("O modelo é obrigatório");
    }

    if (
      typeof placa !== "string" ||
      !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(
        placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
      )
    ) {
      throw new Error("Placa inválida");
    }

    let anoFinal = null;

    if (
      ano !== undefined &&
      ano !== null &&
      ano !== ""
    ) {
      anoFinal = Number(ano);

      if (
        !Number.isInteger(anoFinal) ||
        anoFinal < 1886 ||
        anoFinal > 2100
      ) {
        throw new Error("Ano do veículo inválido");
      }
    }

    if (
      cor !== undefined &&
      cor !== null &&
      typeof cor !== "string"
    ) {
      throw new Error("Cor inválida");
    }

    if (
      observacoes !== undefined &&
      observacoes !== null &&
      typeof observacoes !== "string"
    ) {
      throw new Error("Observações inválidas");
    }

    return {
      clienteId,
      marca: marca.trim(),
      modelo: modelo.trim(),
      placa: placa.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(),
      ano: anoFinal,
      cor: cor?.trim() || null,
      observacoes: observacoes?.trim() || null
    };
  }

  static async listar(usuarioId, clienteId = null) {
    return await VeiculoModel.listar(
      usuarioId,
      clienteId
    );
  }

  static async buscarPorId(id, usuarioId) {
    return await VeiculoModel.buscarPorId(
      id,
      usuarioId
    );
  }

  static async criar(data, usuarioId) {
    const dados = this.validarDados(data);

    return await VeiculoModel.criar({
      ...dados,
      usuarioId
    });
  }

  static async atualizar(id, data, usuarioId) {
    const dados = this.validarDados(data);

    return await VeiculoModel.atualizar(id, {
      ...dados,
      usuarioId
    });
  }

  static async excluir(id, usuarioId) {
    return await VeiculoModel.excluir(
      id,
      usuarioId
    );
  }
}

module.exports = VeiculosService;
