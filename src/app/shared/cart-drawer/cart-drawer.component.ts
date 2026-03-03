import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartService, Cart, CartItem } from '../../features/cart/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-drawer.component.html',
  styleUrls: ['./cart-drawer.component.css']
})
export class CartDrawerComponent implements OnInit, OnDestroy {

  @Output() fermer = new EventEmitter<void>();

  cart:             Cart | null = null;
  isLoading                     = false;
  removingId:       string | null = null;
  removingTicketId: string | null = null; //

  get totalArticles(): number {
    const produits = this.cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    const billets  = this.cart?.ticketItems?.reduce((s, i) => s + i.quantity, 0) ?? 0; //
    return produits + billets;
  }

  get totalPrix(): number {
    return this.cart?.total ?? 0;
  }

  //   Getters pour simplifier le template
  get aProduits(): boolean {
    return (this.cart?.items?.length ?? 0) > 0;
  }

  get aBillets(): boolean {
    return (this.cart?.ticketItems?.length ?? 0) > 0;
  }

  private destroy$ = new Subject<void>();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => this.cart = cart);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  //Produits
  modifierQuantite(productId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.modifierQuantite(productId, quantity).subscribe();
  }

  supprimer(productId: string): void {
    this.removingId = productId;
    this.cartService.supprimerArticle(productId).subscribe({
      next:  () => this.removingId = null,
      error: () => this.removingId = null
    });
  }

  //  Billets
  modifierBillet(eventId: string, quantity: number): void {
    if (quantity < 1) return;
    this.cartService.modifierBillet(eventId, quantity).subscribe();
  }

  supprimerBillet(eventId: string): void {
    this.removingTicketId = eventId;
    this.cartService.supprimerBillet(eventId).subscribe({
      next:  () => this.removingTicketId = null,
      error: () => this.removingTicketId = null
    });
  }

  onFermer(): void {
    this.fermer.emit();
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  }
}
