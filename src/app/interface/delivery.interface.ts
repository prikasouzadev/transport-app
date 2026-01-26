import { DeliveryStatus } from "../type/delivery-status";

export interface Delivery {
  id: number;
  cliente: string;
  endereco: string;
  dataEnvio: string;
  dataEstimada: string;
  produto: string;
  status: DeliveryStatus;
  observacoes?: string;
}
