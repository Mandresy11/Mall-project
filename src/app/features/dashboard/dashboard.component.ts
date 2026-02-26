import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule }  from '@angular/common';
import { RouterLink }    from '@angular/router';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil }     from 'rxjs/operators';

import { ShopService }   from '../shops/shop.service';
import { AuthService }   from '../auth/auth.service';
import { Shop, Category } from '../models/shop.model';

// ── Interfaces ──────────────────────────────────────────────────────

interface StatCard {
  icon: string;
  label: string;
  value: number | string;
  gradient: string;
  suffix?: string;
}

interface ShopRow extends Shop {
  initials: string;
  color: string;
}

interface CategorieStats {
  name: string;
  icon: string;
  count: number;
  percent: number;
}



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {

  boutiques: ShopRow[]         = [];
  categories: Category[]       = [];
  boutiquesRecentes: ShopRow[] = [];
  boutiquesFiltered: ShopRow[] = [];
  statCards: StatCard[]        = [];
  categoryStats: CategorieStats[] = [];

  isLoading   = true;
  hasError    = false;
  searchQuery = '';
  adminName    = '';
  greetingHour = '';
  currentDate  = '';

  private destroy$ = new Subject<void>();

  private palette = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe',
    '#43e97b', '#fa709a', '#fee140', '#30cfd0',
    '#a18cd1', '#fbc2eb', '#84fab0', '#8fd3f4'
  ];

  constructor(
    private shopService: ShopService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}



  ngOnInit(): void {
    this.initGreeting();
    this.loadData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Salutation ───────────────────────────────────────────────────

  private initGreeting(): void {
    const now = new Date();
    const h   = now.getHours();
    this.greetingHour = h < 12 ? 'Bonjour' : h < 18 ? 'Bon après-midi' : 'Bonsoir';

    const raw = localStorage.getItem('utilisateur');
    this.adminName = raw ? JSON.parse(raw) : 'Admin';

    const dateStr = now.toLocaleDateString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
    this.currentDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  }

  // ── Chargement des données ────────────────────────────────────────

  loadData(): void {
    this.isLoading = true;
    this.hasError  = false;

    forkJoin({
      shops:      this.shopService.chargerLesBoutiques(),
      categories: this.shopService.chargerCategories()
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: ({ shops, categories }) => {
        this.categories        = categories;
        this.boutiques         = shops.map((s, i) => this.enrichShop(s, i));
        this.boutiquesFiltered = [...this.boutiques];
        this.boutiquesRecentes = this.boutiques.slice(0, 5);
        this.buildKPIs(shops.length, categories.length);
        this.buildCategoryStats(shops);


        this.isLoading = false;


        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Erreur API:', err.status, err.message);
        this.hasError  = true;
        this.isLoading = false;


        this.cdr.detectChanges();
      }
    });
  }



  private enrichShop(shop: Shop, index: number): ShopRow {
    const words    = shop.name.trim().split(' ').filter(Boolean);
    const initials = words.length >= 2
      ? (words[0][0] + words[1][0]).toUpperCase()
      : shop.name.slice(0, 2).toUpperCase();
    return { ...shop, initials, color: this.palette[index % this.palette.length] };
  }



  private buildKPIs(totalShops: number, totalCategories: number): void {
    this.statCards = [
      { icon: '🏬', label: 'Boutiques actives',  value: totalShops,      gradient: 'gradient-purple' },
      { icon: '🗂️', label: 'Catégories',         value: totalCategories, gradient: 'gradient-blue'   },
      { icon: '📍', label: 'Niveaux couverts',   value: this.countLevels(), gradient: 'gradient-green' },
      {
        icon: '⭐', label: 'Taux de remplissage',
        value: Math.min(Math.round((totalShops / 150) * 100), 100),
        gradient: 'gradient-orange', suffix: '%'
      }
    ];
  }

  private countLevels(): number {
    return new Set(this.boutiques.map(b => b.location.level)).size;
  }

  // Stats catégories

  private buildCategoryStats(shops: Shop[]): void {
    const total = shops.length || 1;
    const map   = new Map<string, { icon: string; count: number }>();

    shops.forEach(s => {
      const key = s.category.name;
      const cur = map.get(key);
      if (cur) cur.count++;
      else map.set(key, { icon: s.category.icon, count: 1 });
    });

    this.categoryStats = Array.from(map.entries())
      .map(([name, { icon, count }]) => ({
        name, icon, count,
        percent: Math.round((count / total) * 100)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  //Recherche

  onSearch(event: Event): void {
    const q = (event.target as HTMLInputElement).value.toLowerCase().trim();
    this.searchQuery       = q;
    this.boutiquesFiltered = q
      ? this.boutiques.filter(b =>
          b.name.toLowerCase().includes(q) ||
          b.category.name.toLowerCase().includes(q) ||
          b.location.section.toLowerCase().includes(q)
        )
      : [...this.boutiques];
  }

  // Retry

  retry(): void {
    this.loadData();
  }
}
