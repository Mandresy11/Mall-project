import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ShopsComponent } from './features/shops/shops.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { EventsComponent } from './features/events/events.component';
import { authGuard } from './guards/auth-guard';
import { adminGuard } from './guards/admin-guard';

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

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [adminGuard]
  },

  // Redirection si la route n'existe pas
  {
    path: '**',
    redirectTo: ''
  }
];
