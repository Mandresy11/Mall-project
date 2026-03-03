import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, Cart } from './cart.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {

  cart:       Cart | null = null;
  isLoading   = true;
  isOrdering  = false;
  noteCommande = '';
  erreur      = '';

  // Pour grouper les articles par boutique
  get itemsParBoutique(): { shopName: string; shopLogo: string; items: any[] }[] {
    if (!this.cart?.items) return [];
    const map = new Map<string, any>();

    this.cart.items.forEach(item => {
      const shopId = item.shop._id;
      if (!map.has(shopId)) {
        map.set(shopId, {
          shopName: item.shop.name,
          shopLogo: item.shop.logo,
          shopId,
          items: []
        });
      }
      map.get(shopId).items.push(item);
    });

    return Array.from(map.values());
  }

  get totalArticles(): number {
    return this.cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  }

  get totalPrix(): number {
    return this.cart?.total ?? 0;
  }

  private destroy$ = new Subject<void>();

  constructor(
    private cartService:  CartService,
    private orderService: OrderService,
    private router:       Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => {
        this.cart      = cart;
        this.isLoading = false;
      });

    this.cartService.chargerPanier().subscribe({
      error: () => { this.isLoading = false; }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ─── Actions ─────────────────────────────────────────────────────────────

  modifierQuantite(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.modifierQuantite(productId, quantity).subscribe({
      error: (err) => this.erreur = err.error?.message || 'Erreur'
    });
  }

  supprimer(productId: string): void {
    this.cartService.supprimerArticle(productId).subscribe({
      error: (err) => this.erreur = err.error?.message || 'Erreur'
    });
  }

  vider(): void {
    if (!confirm('Vider le panier ?')) return;
    this.cartService.viderPanier().subscribe();
  }

  passerCommande(): void {
    this.isOrdering = true;
    this.erreur     = '';

    this.orderService.passerCommande(this.noteCommande).subscribe({
      next: (order) => {
        this.isOrdering = false;
        this.router.navigate(['/commandes', order._id, 'confirmation']);
      },
      error: (err) => {
        this.erreur     = err.error?.message || 'Erreur lors de la commande.';
        this.isOrdering = false;
      }
    });
  }
}
