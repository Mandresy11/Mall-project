import { Shop} from './../../models/shop.model';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ShopService } from '../shop.service';
import { environment } from '../../../../environments/environment.development';

//Interface Product ajoutée
interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
  image: string;
  description: string;
}

@Component({
  selector: 'app-shop-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.css']
})
export class ShopDetailComponent implements OnInit {

  shop: Shop | null = null;
  isLoading = true;
  notFound = false;
  products: Product[] = []; // 🆕
  apiUrl = environment.apiUrl;

  // 🆕 Données produits par boutique
  private tousLesProduits: { [key: string]: Product[] } = {
    '1': [
      { _id: 'p1', name: 'Veste en cuir premium',    price: 1299,  stock: 5,  image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400', description: 'Veste en cuir véritable, coupe slim' },
      { _id: 'p2', name: 'Robe de soirée',           price: 890,   stock: 3,  image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400', description: 'Élégante robe longue pour vos soirées' },
      { _id: 'p3', name: 'Jean slim fit',            price: 450,   stock: 12, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', description: 'Jean stretch coupe slim moderne' },
      { _id: 'p4', name: 'Chemise en lin',           price: 320,   stock: 8,  image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400', description: 'Chemise légère en lin naturel' },
    ],
    '2': [
      { _id: 'p5', name: 'iPhone 15 Pro',            price: 12999, stock: 10, image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=400', description: 'Dernière génération Apple avec puce A17' },
      { _id: 'p6', name: 'MacBook Air M3',           price: 18500, stock: 4,  image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', description: 'Ultra-léger, ultra-puissant' },
      { _id: 'p7', name: 'Samsung 4K OLED 65"',      price: 22000, stock: 2,  image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829e1?w=400', description: 'TV premium avec image parfaite' },
      { _id: 'p8', name: 'AirPods Pro 2',            price: 2800,  stock: 15, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400', description: 'Réduction de bruit active' },
    ],
    '3': [
      { _id: 'p9',  name: 'Menu Dégustation',        price: 450,   stock: 20, image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', description: '7 plats signatures du Chef' },
      { _id: 'p10', name: 'Formule Déjeuner',        price: 180,   stock: 30, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400', description: 'Entrée + plat + dessert du jour' },
      { _id: 'p11', name: 'Plateau de fromages',     price: 120,   stock: 15, image: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?w=400', description: 'Sélection affinée des meilleurs fromages' },
    ],
    '4': [
      { _id: 'p12', name: 'Parfum Chanel N°5',       price: 1200,  stock: 6,  image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=400', description: 'Icône intemporelle de la parfumerie' },
      { _id: 'p13', name: 'Crème anti-âge Dior',     price: 890,   stock: 8,  image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400', description: 'Soin luxueux régénérant' },
      { _id: 'p14', name: 'Rouge à lèvres YSL',      price: 280,   stock: 20, image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf2a59?w=400', description: 'Rouge intense longue tenue 24h' },
    ],
    '5': [
      { _id: 'p15', name: 'Vélo de route carbone',   price: 8500,  stock: 3,  image: 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=400', description: 'Cadre carbone ultra-léger compétition' },
      { _id: 'p16', name: 'Chaussures Nike Air Max', price: 1200,  stock: 10, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', description: 'Amorti exceptionnel pour le running' },
      { _id: 'p17', name: 'Raquette Wilson Pro',     price: 950,   stock: 7,  image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400', description: 'Contrôle et puissance optimaux' },
    ],
    '6': [
      { _id: 'p18', name: 'LEGO Technic 4x4',        price: 650,   stock: 5,  image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400', description: 'Construction motorisée 958 pièces' },
      { _id: 'p19', name: 'Poupée interactive',      price: 350,   stock: 8,  image: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400', description: 'Parle et répond à la voix' },
      { _id: 'p20', name: 'Console Nintendo Switch', price: 3200,  stock: 4,  image: 'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=400', description: 'Jouez partout, tout le temps' },
    ],
    '7': [
      { _id: 'p21', name: 'Rolex Submariner',        price: 85000, stock: 1,  image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', description: 'Icône absolue de l\'horlogerie de luxe' },
      { _id: 'p22', name: 'Omega Seamaster',         price: 45000, stock: 2,  image: 'https://images.unsplash.com/photo-1619946794135-5bc917a27793?w=400', description: 'Précision et élégance suisse' },
      { _id: 'p23', name: 'Bracelet en or 18K',      price: 12000, stock: 4,  image: 'https://images.unsplash.com/photo-1573408301185-9519f94ae4e2?w=400', description: 'Or jaune massif 18 carats' },
    ],
    '8': [
      { _id: 'p24', name: 'Panier fruits exotiques', price: 180,   stock: 20, image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400', description: 'Sélection de fruits de saison' },
      { _id: 'p25', name: 'Plateau charcuterie',     price: 250,   stock: 10, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', description: 'Jambon, saucisson, pâtés artisanaux' },
      { _id: 'p26', name: 'Château Margaux 2018',    price: 1800,  stock: 5,  image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400', description: 'Grand cru Bordeaux millésime exceptionnel' },
    ]
  };

  constructor(private route: ActivatedRoute, private shopService: ShopService) {}

  ngOnInit(): void {
    this.isLoading = true;
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.shopService.chargerBoutiqueParId(id).subscribe({
        next: (shop) => {
          if (shop && shop._id) {
            console.log('Boutique chargée :', shop);
            this.shop = {
              ...shop,
              logo: shop.logo ? this.apiUrl + shop.logo : undefined,
              coverPhoto: shop.coverPhoto ? this.apiUrl + shop.coverPhoto : undefined
            };
            this.notFound = false;
          } else {
            this.notFound = true;
          }
          this.isLoading = false;  // stop spinner
        },
        error: (err) => {
          console.error(err);
          this.notFound = true;
          this.isLoading = false;
        }
      });
    } else {
      this.notFound = true;
      this.isLoading = false;
    }
}

  avoirIconeCategorie(categorie: string): string {
    const icones: any = {
      'Mode & Vêtements':     '👔',
      'Électronique':         '📱',
      'Restauration':         '🍽️',
      'Beauté & Cosmétiques': '💄',
      'Sports & Loisirs':     '⚽',
      'Autre':                '🏪'
    };
    return icones[categorie] || '🏪';
  }

  getTelLink(): string {
    return this.shop ? 'tel:' + this.shop.phoneNumber?.replace(/\s/g, '') : '#';
  }
}
