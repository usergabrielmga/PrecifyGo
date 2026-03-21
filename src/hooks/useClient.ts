import { useEffect, useState } from "react";
import {
  createCliente,
  deleteCliente,
  getClientes,
  updateCliente,
} from "../services/clienteService";
import type { Cliente } from "../types/client";
import { useNotification } from "../context/useNotification";

export function useClient() {
  const { showNotification } = useNotification();

  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    fetchClientes();
  }, []);

  async function fetchClientes() {
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      showNotification("Erro ao buscar clientes");
      console.error(error);
    }
  }

  // 🔥 NORMALIZAÇÃO (resolve TODOS os erros de undefined)
  function normalizeCliente(data: Omit<Cliente, "id">) {
    return {
      nome: data.nome,
      email: data.email || "",
      telefone: data.telefone || "",
      endereco: data.endereco || "",
      cpf_cnpj: data.cpf_cnpj || "",
    };
  }

  // ✅ CREATE
  async function handleCreate(data: Omit<Cliente, "id">) {
    try {
      const payload = normalizeCliente(data);

      const { clienteId } = await createCliente(payload);

      setClientes((prev) => [
        ...prev,
        {
          id: clienteId,
          ...payload,
        },
      ]);

      showNotification("Cliente criado com sucesso");
    } catch (error) {
      showNotification("Erro ao criar cliente");
      console.error(error);
    }
  }

  // ✅ UPDATE
  async function handleUpdate(id: number, data: Omit<Cliente, "id">) {
    try {
      const payload = normalizeCliente(data);

      await updateCliente(id, payload);

      setClientes((prev) =>
        prev.map((cliente) =>
          cliente.id === id ? { ...cliente, ...payload } : cliente
        )
      );

      showNotification("Cliente atualizado com sucesso");
    } catch (error) {
      showNotification("Erro ao atualizar cliente");
      console.error(error);
    }
  }

  // ✅ DELETE
  async function handleDelete(id: number) {
    try {
      await deleteCliente(id);

      setClientes((prev) =>
        prev.filter((cliente) => cliente.id !== id)
      );

      showNotification("Cliente excluído com sucesso");
    } catch (error) {
      showNotification(
        "Erro ao excluir cliente: possui vínculos"
      );
      console.error(error);
    }
  }

  return {
    clientes,
    handleCreate,
    handleUpdate,
    handleDelete,
  };
}