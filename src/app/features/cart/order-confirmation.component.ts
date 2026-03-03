import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { OrderService, Order } from './order.service';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent implements OnInit {

  order:     Order | null = null;
  isLoading = true;
  erreur    = '';

  readonly statusLabels: Record<string, string> = {
    pending:   '&#x23F3; En attente',
    confirmed: '&#x2705; Confirmée',
    preparing: '&#x1F373; En préparation',
    ready:     '&#x1F6CE;&#xFE0F; Prête',
    delivered: '&#x1F4E6; Livrée',
    cancelled: '&#x274C; Annulée'
  };

  constructor(
    private route:        ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (!orderId) { this.erreur = 'ID commande manquant'; return; }

    this.orderService.detailCommande(orderId).subscribe({
      next: (order) => {
        this.order     = order;
        this.isLoading = false;
      },
      error: () => {
        this.erreur    = 'Commande introuvable.';
        this.isLoading = false;
      }
    });
  }
}
