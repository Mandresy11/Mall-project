import { Routes } from '@angular/router';
import { ShopsComponent } from './features/shops/shops.component';

export const routes: Routes = [
  // Page par défaut : Boutiques
  {
    path: '',
    component: ShopsComponent
  },

  // Page des boutiques
  {
    path: 'boutiques',
    component: ShopsComponent
  },

  // Redirection si la route n'existe pas
  {
    path: '**',
    redirectTo: ''
  }
];
