import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Shop, Category } from '../models/shop.model';
import { ShopService } from './shop.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-shops',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopsComponent implements OnInit {

  constructor(private shopService: ShopService, private router: Router, private cdr: ChangeDetectorRef) {}

  // Toutes nos boutiques
  shops: Shop[] = [];
  apiUrl = environment.apiUrl;

  // Les boutiques qu'on affiche après avoir filtré
  boutiquesAffichees: Shop[] = [];

  // La liste de toutes les catégories possibles
  categories: Category[] = [];

  isLoading = false;

  // Quelle catégorie l'utilisateur a choisi
  categorieChoisie: string = 'tout';

  // Ce que l'utilisateur tape dans la barre de recherche
  recherche: string = '';

  ngOnInit(): void {
    // Au démarrage, on charge les boutiques et catégories
    this.chargerLesBoutiques();
  }

  // Charger toutes les boutiques (pour l'instant c'est du fake, plus tard ça viendra de l'API)
  chargerLesBoutiques(): void {
  this.isLoading = true;
  this.shopService.chargerLesBoutiques().subscribe({
    next: (data) => {
      this.shops = data.map(shop => ({
        ...shop,
        logo: shop.logo ? this.apiUrl + shop.logo : undefined,
        coverPhoto: shop.coverPhoto ? this.apiUrl + shop.coverPhoto : undefined
      }));
      console.log('shops assigned:', this.shops.length);

      const uniqueCategoriesMap = new Map();
      this.shops.forEach(shop => {
        if (shop.category?._id) {
          uniqueCategoriesMap.set(shop.category._id, shop.category);
        }
      });
      this.categories = Array.from(uniqueCategoriesMap.values());
      this.categorieChoisie = 'tout';
      this.boutiquesAffichees = [...this.shops]; // 👈 directly assign instead of calling appliquerLesFiltres
      this.isLoading = false;
      this.cdr.detectChanges(); 
    },
    error: (err) => {
      console.error(err);
      this.isLoading = false;
    }
  });
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
      // Normalize boutique category value: could be string, or object with _id/name
      const catVal: any = (boutique && boutique.category) ? boutique.category : null;
      let boutiqueCatIdentifier: string | null = null;
      if (catVal === null || catVal === undefined) {
        boutiqueCatIdentifier = null;
      } else if (typeof catVal === 'string') {
        boutiqueCatIdentifier = catVal;
      } else if (typeof catVal === 'object') {
        boutiqueCatIdentifier = (catVal._id) ? catVal._id : catVal.name;
      }

      let bonneCategorie = this.categorieChoisie === 'tout' || (boutiqueCatIdentifier === this.categorieChoisie);

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
    // Try to resolve icon from loaded categories (by _id or name)
    const trouvé = this.categories.find(c => c._id === categorie || c.name === categorie);
    if (trouvé && trouvé.icon) return trouvé.icon;

    // Fallback dictionary when categories not yet loaded or unknown
    const icones: any = {
      'Mode & Vêtements': '👔',
      'Électronique': '📱',
      'Restauration': '🍽️',
      'Beauté & Cosmétiques': '💄',
      'Sports & Loisirs': '⚽',
      'Autre': '🏪'
    };

    return icones[categorie] || '🏪';
  }

  // Compter combien de boutiques il y a dans une catégorie
  combienDansCetteCategorie(categorie: string): number {
    let compteur = 0;

    // On parcourt toutes les boutiques
    for (let boutique of this.shops) {
      // Si la boutique est dans cette catégorie, on ajoute 1 au compteur
      if ((boutique.category as any)._id === categorie || boutique.category.name === categorie) {
        compteur++;
      }
    }

    return compteur;
  }
}
