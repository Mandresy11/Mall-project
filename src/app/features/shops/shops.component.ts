import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Shop, ShopCategory } from '../models/shop.model';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopsComponent implements OnInit {

  // Toutes nos boutiques
  shops: Shop[] = [];

  // Les boutiques qu'on affiche après avoir filtré
  boutiquesAffichees: Shop[] = [];

  // La liste de toutes les catégories possibles
  categories = Object.values(ShopCategory);

  // Quelle catégorie l'utilisateur a choisi
  categorieChoisie: string = 'tout';

  // Ce que l'utilisateur tape dans la barre de recherche
  recherche: string = '';

  ngOnInit(): void {
    // Au démarrage, on charge les boutiques
    this.chargerLesBoutiques();
  }

  // Charger toutes les boutiques (pour l'instant c'est du fake, plus tard ça viendra de l'API)
  chargerLesBoutiques(): void {
    this.shops = [
      {
        _id: '1',
        name: 'Fashion House',
        description: 'Les dernières tendances de la mode internationale.',
        location: 'Niveau 2, Section A',
        category: 'Mode & Vêtements',
        logo: 'https://images.unsplash.com/photo-1521334884684-d80222895322?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'
      },
      {
        _id: '2',
        name: 'TechZone',
        description: 'Smartphones, laptops, accessoires et produits high-tech.',
        location: 'Niveau 1, Section B',
        category: 'Électronique',
        logo: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800'
      },
      {
        _id: '3',
        name: 'Gourmet Palace',
        description: 'Restaurant gastronomique, cuisine locale et internationale.',
        location: 'Niveau 3, Food Court',
        category: 'Restauration',
        logo: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'
      },
      {
        _id: '4',
        name: 'Beauty World',
        description: 'Cosmétiques, parfums et soins de beauté.',
        location: 'Niveau 2, Section C',
        category: 'Beauté & Cosmétiques',
        logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800'
      },
      {
        _id: '5',
        name: 'Sport Center',
        description: 'Articles et équipements sportifs pour tous.',
        location: 'Niveau 1, Section A',
        category: 'Sports & Loisirs',
        logo: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=800'
      },
      {
        _id: '6',
        name: 'Kids Paradise',
        description: 'Jouets, vêtements et accessoires pour enfants.',
        location: 'Niveau 2, Section D',
        category: 'Autre',
        logo: 'https://images.unsplash.com/photo-1515488764276-beab7607c1e6?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?w=800'
      },
      {
        _id: '7',
        name: 'Luxury Watches',
        description: 'Montres de luxe et bijouterie haut de gamme.',
        location: 'Niveau 1, Section C',
        category: 'Mode & Vêtements',
        logo: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800'
      },
      {
        _id: '8',
        name: 'Fresh Market',
        description: 'Produits frais et épicerie fine de qualité.',
        location: 'Niveau -1, Food Zone',
        category: 'Restauration',
        logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200',
        coverPhoto: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800'
      }
    ];

    // Au début on affiche toutes les boutiques
    this.boutiquesAffichees = [...this.shops];
  }

  // Quand l'utilisateur clique sur une catégorie
  filtrerParCategorie(categorie: string): void {
    this.categorieChoisie = categorie;
    this.appliquerLesFiltres();
  }

  // Quand l'utilisateur tape quelque chose dans la barre de recherche
  quandOnCherche(event: any): void {
    this.recherche = event.target.value;
    this.appliquerLesFiltres();
  }

  // Appliquer tous les filtres actifs (catégorie + recherche)
  appliquerLesFiltres(): void {
    this.boutiquesAffichees = this.shops.filter(boutique => {

      // Est-ce que la boutique correspond à la catégorie choisie ?
      let bonneCategorie =
        this.categorieChoisie === 'tout' ||
        boutique.category === this.categorieChoisie;

      // Est-ce que le nom ou la description contient ce qu'on cherche ?
      let correspondRecherche =
        this.recherche === '' ||
        boutique.name.toLowerCase().includes(this.recherche.toLowerCase()) ||
        boutique.description.toLowerCase().includes(this.recherche.toLowerCase());

      // On garde la boutique seulement si les deux conditions sont bonnes
      return bonneCategorie && correspondRecherche;
    });
  }

  // Remettre tous les filtres à zéro
  toutReinitialiser(): void {
    this.categorieChoisie = 'tout';
    this.recherche = '';
    this.boutiquesAffichees = [...this.shops];
  }

  // Retourner l'emoji qui correspond à une catégorie
  avoirIconeCategorie(categorie: string): string {
    // On fait un petit dictionnaire des icônes
    let icones: any = {
      'Mode & Vêtements': '👔',
      'Électronique': '📱',
      'Restauration': '🍽️',
      'Beauté & Cosmétiques': '💄',
      'Sports & Loisirs': '⚽',
      'Autre': '🏪'
    };

    // Si la catégorie existe dans notre dictionnaire, on retourne l'icône
    // Sinon on retourne une icône par défaut
    return icones[categorie] || '🏪';
  }

  // Compter combien de boutiques il y a dans une catégorie
  combienDansCetteCategorie(categorie: string): number {
    let compteur = 0;

    // On parcourt toutes les boutiques
    for (let boutique of this.shops) {
      // Si la boutique est dans cette catégorie, on ajoute 1 au compteur
      if (boutique.category === categorie) {
        compteur++;
      }
    }

    return compteur;
  }
}
