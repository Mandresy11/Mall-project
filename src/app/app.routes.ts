import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopsComponent } from './features/shops/shops.component';

import { EventsComponent } from './features/events/events.component';

export const routes: Routes = [
  // Page d'accueil
  {
    path: '',
    component: HomeComponent
  },

  // Page des boutiques
  {
    path: 'boutiques',
    component: ShopsComponent
  },



  // Page des événements
  {
    path: 'evenements',
    component: EventsComponent
  },

  // Redirection si la route n'existe pas
  {
    path: '**',
    redirectTo: ''
  }
];
