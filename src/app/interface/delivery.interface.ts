import { DeliveryStatus } from "../type/delivery-status";
import { DeliveryHistory } from "./delivery-history";

export interface Delivery {
  id: number;
  cliente: string;
  endereco: string;
  dataEnvio: string;
  dataEstimada: string;
  produto: string;
  status: DeliveryStatus;
  observacoes?: string;
  historico: DeliveryHistory[];
}
