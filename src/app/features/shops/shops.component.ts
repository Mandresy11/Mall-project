// Imports principaux d’Angular
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Model Shop (interface + enum)
import { Shop, ShopCategory } from '../models/shop.model';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: '<p>Composant Shops en cours..</p>',
})
export class ShopsComponent implements OnInit {

  // Liste de toutes les boutiques
  shops: Shop[] = [];

  // Liste utilisée pour l’affichage après filtres
  filteredShops: Shop[] = [];

  // Récupère toutes les catégories depuis l’enum
  categories = Object.values(ShopCategory);

  // Catégorie selectionnée (par défaut : toutes)
  selectedCategory: string = 'all';

  // Texte tapé dans la barre de recherche
  searchTerm: string = '';

  ngOnInit(): void {
    // Chargement des données au démarrage du composant
    this.loadShops();
  }

  // Données temporaires (plus tard viendront de l’API)
  loadShops(): void {
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
      }
    ];

    // Au début on affiche tout
    this.filteredShops = [...this.shops];
  }

  // Quand l’utilisateur change la catégorie
  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  // Quand l’utilisateur tape dans la recherche
  onSearchChange(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  // Applique les filtres actuels
  applyFilters(): void {
    this.filteredShops = this.shops.filter(shop => {

      const matchCategory =
        this.selectedCategory === 'all' ||
        shop.category === this.selectedCategory;

      const matchSearch =
        this.searchTerm === '' ||
        shop.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        shop.description.toLowerCase().includes(this.searchTerm.toLowerCase());

      return matchCategory && matchSearch;
    });
  }

  // Remise à zéro des filtres
  resetFilters(): void {
    this.selectedCategory = 'all';
    this.searchTerm = '';
    this.filteredShops = [...this.shops];
  }
}
