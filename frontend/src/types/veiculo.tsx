export interface Veiculo {
  id_veiculo: number;
  cliente_id: number;
  usuario_id: number;
  marca: string;
  modelo: string;
  placa: string;
  ano: number | null;
  cor: string | null;
  observacoes: string | null;
  nome_cliente?: string;
}

export interface VeiculoPayload {
  cliente_id: number;
  marca: string;
  modelo: string;
  placa: string;
  ano: number | null;
  cor: string;
  observacoes: string;
}