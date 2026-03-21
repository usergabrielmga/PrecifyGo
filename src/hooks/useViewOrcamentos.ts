import { useEffect, useState } from "react";
import { getOrcamentos } from "../services/orcamentoService";
import type { Orcamento } from "../types/orcamento";

export function useViewOrcamentos(status: string | undefined) {
  const [orcamentos, setOrcamentos] = useState<Orcamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrcamentos() {
      try {
        const data = await getOrcamentos();

        const filtrados = status
          ? data.filter((o: { status: string; }) =>
              o.status.toLowerCase() === status.toLowerCase()
            )
          : data;

        setOrcamentos(filtrados);
      } catch (error) {
        console.error("Erro ao buscar orçamentos", error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrcamentos();
  }, [status]);

  return { orcamentos, loading };
}