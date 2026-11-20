import { useCallback, useEffect, useState } from "react";
import {
  getVeiculos,
  createVeiculo,
  updateVeiculo,
  deleteVeiculo,
} from "../services/veiculoService";

import type { Veiculo, VeiculoPayload } from "../types/veiculo";

export function useVeiculo() {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarVeiculos = useCallback(async () => {
    try {
      setErro("");
      const dados = await getVeiculos();
      setVeiculos(dados);
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar veículos"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarVeiculos();
  }, [carregarVeiculos]);

  async function handleCreate(data: VeiculoPayload) {
    await createVeiculo(data);
    await carregarVeiculos();
  }

  async function handleUpdate(id: number, data: VeiculoPayload) {
    await updateVeiculo(id, data);
    await carregarVeiculos();
  }

  async function handleDelete(id: number) {
    await deleteVeiculo(id);
    await carregarVeiculos();
  }

  return {
    veiculos,
    loading,
    erro,
    handleCreate,
    handleUpdate,
    handleDelete,
    carregarVeiculos,
  };
}