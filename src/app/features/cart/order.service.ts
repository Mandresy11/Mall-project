import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface OrderItem {
  product:      { _id: string; name: string; image: string };
  shop:         { _id: string; name: string; location: any; logo: string };
  quantity:     number;
  priceAtOrder: number;
  productName:  string;
}

export interface Order {
  _id:         string;
  orderNumber: string;
  items:       OrderItem[];
  totalAmount: number;
  status:      'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  note:        string;
  createdAt:   string;
  user:        { username: string; email: string };
}

@Injectable({ providedIn: 'root' })
export class OrderService {

  private apiUrl = environment.apiUrl + '/api/orders';

  constructor(private http: HttpClient) {}

  passerCommande(note: string = ''): Observable<Order> {
    return this.http.post<{ order: Order }>(`${this.apiUrl}/create`, { note }).pipe(
      map(res => res.order)
    );
  }

  mesCommandes(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>(`${this.apiUrl}/my`).pipe(
      map(res => res.orders)
    );
  }

  detailCommande(orderId: string): Observable<Order> {
    return this.http.get<{ order: Order }>(`${this.apiUrl}/${orderId}`).pipe(
      map(res => res.order)
    );
  }

  // Admin
  toutesLesCommandes(): Observable<Order[]> {
    return this.http.get<{ orders: Order[] }>(this.apiUrl).pipe(
      map(res => res.orders)
    );
  }

  changerStatut(orderId: string, status: string): Observable<Order> {
    return this.http.put<{ order: Order }>(`${this.apiUrl}/${orderId}/status`, { status }).pipe(
      map(res => res.order)
    );
  }
}
