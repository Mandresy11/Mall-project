import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

export interface CartItem {
  product: {
    _id:   string;
    name:  string;
    price: number;
    image: string;
    stock: number;
  };
  shop: {
    _id:      string;
    name:     string;
    location: { level: number; section: string };
    logo:     string;
  };
  quantity:   number;
  priceAtAdd: number;
}

//     Interface billet
export interface TicketItem {
  event: {
    _id:           string;
    title:         string;
    image:         string;
    eventDateTime: string;
    price:         number;
    isFree:        boolean;
    category:      { name: string; icon: string };
  };
  quantity:   number;
  priceAtAdd: number;
  ticketDate: string;
  ticketType: string;
}

export interface Cart {
  _id:         string;
  user:        string;
  items:       CartItem[];
  ticketItems: TicketItem[]; //    
  total:       number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private apiUrl     = environment.apiUrl + '/api/cart';
  private storageUrl = environment.apiUrl.replace('/api', '');

  private cartSubject = new BehaviorSubject<Cart | null>(null);
  cart$               = this.cartSubject.asObservable();

  private countSubject = new BehaviorSubject<number>(0);
  count$               = this.countSubject.asObservable();

  constructor(private http: HttpClient) {}

  // ─── Charger le panier ───────────────────────────────────────────────────
  chargerPanier(): Observable<Cart> {
    return this.http.get<{ cart: Cart }>(this.apiUrl).pipe(
      map(res => this.normaliserPanier(res.cart)),
      tap(cart => this.mettreAJourEtat(cart))
    );
  }

  // ─── Ajouter un produit ──────────────────────────────────────────────────
  ajouterAuPanier(productId: string, quantity: number = 1): Observable<Cart> {
    return this.http.post<{ cart: Cart }>(`${this.apiUrl}/add`, { productId, quantity }).pipe(
      map(res => this.normaliserPanier(res.cart)),
      tap(cart => this.mettreAJourEtat(cart))
    );
  }

  // ─── Modifier la quantité ────────────────────────────────────────────────
  modifierQuantite(productId: string, quantity: number): Observable<Cart> {
    return this.http.put<{ cart: Cart }>(`${this.apiUrl}/update`, { productId, quantity }).pipe(
      map(res => this.normaliserPanier(res.cart)),
      tap(cart => this.mettreAJourEtat(cart))
    );
  }

  // ─── Supprimer un article ────────────────────────────────────────────────
  supprimerArticle(productId: string): Observable<Cart> {
    return this.http.delete<{ cart: Cart }>(`${this.apiUrl}/remove/${productId}`).pipe(
      map(res => this.normaliserPanier(res.cart)),
      tap(cart => this.mettreAJourEtat(cart))
    );
  }

  // ─── Vider le panier ─────────────────────────────────────────────────────
  viderPanier(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/clear`).pipe(
      tap(() => {
        this.cartSubject.next(null);
        this.countSubject.next(0);
      })
    );
  }

  // ─── Réinitialiser localement (après déconnexion) ────────────────────────
  reinitialiser(): void {
    this.cartSubject.next(null);
    this.countSubject.next(0);
  }

  // ───     Ajouter un billet ────────────────────────────────────────────────
  ajouterBillet(
    eventId:     string,
    quantity:    number = 1,
    ticketDate?: string,
    ticketType:  string = 'standard'
  ): Observable<Cart> {
    return this.http.post<{ cart: Cart }>(`${this.apiUrl}/tickets/add`, {
      eventId, quantity, ticketDate, ticketType
    }).pipe(
      map(res => this.normaliserPanier(res.cart)),
      tap(cart => this.mettreAJourEtat(cart))
    );
  }

  // ───     Modifier la quantité d'un billet ─────────────────────────────────
  modifierBillet(eventId: string, quantity: number): Observable<Cart> {
    return this.http.put<{ cart: Cart }>(`${this.apiUrl}/tickets/update`, {
      eventId, quantity
    }).pipe(
      map(res => this.normaliserPanier(res.cart)),
      tap(cart => this.mettreAJourEtat(cart))
    );
  }

  // ───     Supprimer un billet ──────────────────────────────────────────────
  supprimerBillet(eventId: string): Observable<Cart> {
    return this.http.delete<{ cart: Cart }>(
      `${this.apiUrl}/tickets/remove/${eventId}`
    ).pipe(
      map(res => this.normaliserPanier(res.cart)),
      tap(cart => this.mettreAJourEtat(cart))
    );
  }

  // ─── Helpers privés ──────────────────────────────────────────────────────
  private normaliserPanier(cart: Cart): Cart {
    if (!cart) return cart;
    return {
      ...cart,
      //     total inclut produits + billets
      total: [
        ...(cart.items       || []).map(i => i.priceAtAdd * i.quantity),
        ...(cart.ticketItems || []).map(i => i.priceAtAdd * i.quantity)
      ].reduce((a, b) => a + b, 0),
      items: (cart.items || []).map(item => ({
        ...item,
        product: {
          ...item.product,
          image: item.product?.image
            ? this.storageUrl + item.product.image
            : 'assets/placeholder.png'
        },
        shop: {
          ...item.shop,
          logo: item.shop?.logo ? this.storageUrl + item.shop.logo : ''
        }
      })),
      //     normaliser les images des billets
      ticketItems: (cart.ticketItems || []).map(item => ({
        ...item,
        event: {
          ...item.event,
          image: item.event?.image
            ? this.storageUrl + item.event.image
            : 'assets/event-placeholder.png'
        }
      }))
    };
  }

  private mettreAJourEtat(cart: Cart): void {
    this.cartSubject.next(cart);
    //     compteur = produits + billets
    const countProduits = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    const countBillets  = cart?.ticketItems?.reduce((s, i) => s + i.quantity, 0) ?? 0;
    this.countSubject.next(countProduits + countBillets);
  }
}
