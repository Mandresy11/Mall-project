import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../features/auth/auth.service';
import { AuthModalComponent } from '../../features/auth/auth-modal/auth-modal.component';
import { User } from '../../features/models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, AuthModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  menuOuvert = false;

  modalVisible                           = false;
  modeModal: 'connexion' | 'inscription' = 'connexion';

  //authentification
  utilisateur: User | null         = null;
  menuUtilisateurOuvert            = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // S'abonner à l'observable — mise à jour automatique à chaque login/logout
    this.authService.utilisateur$.subscribe(u => {
      this.utilisateur = u;
    });
  }

  ouvrirConnexion(): void {
    this.modeModal   = 'connexion';
    this.modalVisible = true;
    this.menuOuvert  = false;  // Fermer le menu mobile si ouvert
  }

  ouvrirInscription(): void {
    this.modeModal   = 'inscription';
    this.modalVisible = true;
    this.menuOuvert  = false;
  }

  fermerModal(): void {
    this.modalVisible = false;
  }

//connecté
  onConnecte(): void {
  }

  //déconnexion
  deconnecter(): void {
    this.authService.deconnecter();
    this.menuUtilisateurOuvert = false;
  }

  //méthode pour basculer le menu utilisateur dans la navbar
  toggleMenuUtilisateur(): void {
    this.menuUtilisateurOuvert = !this.menuUtilisateurOuvert;
  }

//obtient les initiales de l'utilisateur pour l'avatar
  getInitiales(): string {
    if (!this.utilisateur?.fullname) return '?';
    return this.utilisateur.fullname
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
