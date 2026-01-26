import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Delivery } from '../interface/delivery.interface';


@Injectable({ providedIn: 'root' })
export class DeliveryService {
  private apiUrl = 'http://localhost:3000/deliveries';

  constructor(private http: HttpClient) {}

  getDeliveries(): Observable<Delivery[]> {
    return this.http.get<Delivery[]>(this.apiUrl);
  }

  getDeliveryById(id: number): Observable<Delivery> {
    return this.http.get<Delivery>(`${this.apiUrl}/${id}`);
  }

  createDelivery(delivery: Partial<Delivery>): Observable<Delivery> {
    return this.http.post<Delivery>(this.apiUrl, delivery);
  }

  updateDelivery(delivery: Delivery): Observable<Delivery> {
  return this.http.put<Delivery>(`${this.apiUrl}/${delivery.id}`, delivery);
}
}
