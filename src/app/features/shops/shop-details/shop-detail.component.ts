import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';

interface ShopDetail {
  _id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  logo: string;
  coverPhoto: string;
  openingHours: string;
  phone: string;
}

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

  shopId: string = '';
  shop: ShopDetail | null = null;
  products: Product[] = []; // 🆕

  private toutesLesBoutiques: ShopDetail[] = [
    {
      _id: '1', name: 'Fashion House', category: 'Mode & Vêtements',
      description: 'Les dernières tendances de la mode internationale. Retrouvez des collections exclusives de créateurs renommés, des vêtements casual aux tenues de soirée. Nous proposons aussi des services de retouches et conseils mode personnalisés.',
      location: 'Niveau 2, Section A',
      logo: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
      openingHours: 'Lun - Sam : 9h00 - 21h00 | Dim : 10h00 - 19h00',
      phone: '+212 5 22 00 11 22'
    },
    {
      _id: '2', name: 'TechZone', category: 'Électronique',
      description: 'Smartphones, laptops, accessoires et produits high-tech des meilleures marques mondiales. Nos experts vous conseillent et vous accompagnent dans le choix de vos équipements technologiques.',
      location: 'Niveau 1, Section B',
      logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=1200',
      openingHours: 'Lun - Dim : 9h00 - 22h00',
      phone: '+212 5 22 00 33 44'
    },
    {
      _id: '3', name: 'Gourmet Palace', category: 'Restauration',
      description: 'Restaurant gastronomique proposant une cuisine locale et internationale raffinée. Nos chefs vous préparent des plats d\'exception dans une ambiance chaleureuse et élégante.',
      location: 'Niveau 3, Food Court',
      logo: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
      openingHours: 'Mar - Dim : 12h00 - 23h00 | Lun : Fermé',
      phone: '+212 5 22 00 55 66'
    },
    {
      _id: '4', name: 'Beauty World', category: 'Beauté & Cosmétiques',
      description: 'Cosmétiques, parfums et soins de beauté des plus grandes maisons. Nos esthéticiennes professionnelles proposent aussi des soins du visage et du corps en cabine privée.',
      location: 'Niveau 2, Section C',
      logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=1200',
      openingHours: 'Lun - Sam : 10h00 - 20h00',
      phone: '+212 5 22 00 77 88'
    },
    {
      _id: '5', name: 'Sport Center', category: 'Sports & Loisirs',
      description: 'Articles et équipements sportifs pour tous les niveaux. Football, tennis, natation, fitness... Tout ce qu\'il faut pour pratiquer votre sport préféré dans les meilleures conditions.',
      location: 'Niveau 1, Section A',
      logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1200',
      openingHours: 'Lun - Sam : 9h00 - 21h00',
      phone: '+212 5 22 00 99 10'
    },
    {
      _id: '6', name: 'Kids Paradise', category: 'Autre',
      description: 'Jouets, vêtements et accessoires pour enfants de 0 à 14 ans. Un espace de jeu gratuit est disponible dans la boutique. Animations chaque weekend.',
      location: 'Niveau 2, Section D',
      logo: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=1200',
      openingHours: 'Lun - Dim : 10h00 - 20h00',
      phone: '+212 5 22 11 22 33'
    },
    {
      _id: '7', name: 'Luxury Watches', category: 'Mode & Vêtements',
      description: 'Montres de luxe et bijouterie haut de gamme. Rolex, Omega, Cartier... Nos experts horlogers vous conseillent et prennent en charge l\'entretien de vos pièces précieuses.',
      location: 'Niveau 1, Section C',
      logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=1200',
      openingHours: 'Lun - Sam : 10h00 - 19h00',
      phone: '+212 5 22 44 55 66'
    },
    {
      _id: '8', name: 'Fresh Market', category: 'Restauration',
      description: 'Produits frais et épicerie fine de qualité. Fruits, légumes, fromages affinés, charcuteries artisanales et vins sélectionnés. Livraison à domicile disponible.',
      location: 'Niveau -1, Food Zone',
      logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
      coverPhoto: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200',
      openingHours: 'Lun - Dim : 7h00 - 22h00',
      phone: '+212 5 22 77 88 99'
    }
  ];

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.shopId  = this.route.snapshot.paramMap.get('id') || '';
    this.shop    = this.toutesLesBoutiques.find(b => b._id === this.shopId) || null;
    this.products = this.tousLesProduits[this.shopId] || []; // 🆕
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
    return this.shop ? 'tel:' + this.shop.phone.replace(/\s/g, '') : '#';
  }
}
