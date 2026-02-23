import { Component, OnInit, ViewEncapsulation } from '@angular/core';
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
  styleUrls: ['./navbar.component.css'],
  encapsulation: ViewEncapsulation.None  // Les styles s'appliquent partout, même hors du <nav>
})
export class NavbarComponent implements OnInit {

  // Menu burger mobile
  menuOuvert = false;

  // Modal auth
  modalVisible                           = false;
  modeModal: 'connexion' | 'inscription' = 'connexion';

  // Utilisateur connecté
  utilisateur: User | null  = null;
  menuUtilisateurOuvert     = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // On écoute les changements de connexion
    this.authService.utilisateur$.subscribe(u => {
      this.utilisateur = u;
    });
  }

  // Ouvrir le modal en mode connexion
  ouvrirConnexion(): void {
    this.modeModal    = 'connexion';
    this.modalVisible = true;
    this.menuOuvert   = false;
  }

  // Ouvrir le modal en mode inscription
  ouvrirInscription(): void {
    this.modeModal    = 'inscription';
    this.modalVisible = true;
    this.menuOuvert   = false;
  }

  // Fermer le modal
  fermerModal(): void {
    this.modalVisible = false;
  }

  // Appelé quand la connexion est réussie
  onConnecte(): void {}

  // Déconnecter l'utilisateur
  deconnecter(): void {
    this.authService.deconnecter();
    this.menuUtilisateurOuvert = false;
  }

  // Ouvrir ou fermer le menu dropdown
  toggleMenuUtilisateur(): void {
    this.menuUtilisateurOuvert = !this.menuUtilisateurOuvert;
  }

  // Retourner les 2 premières initiales du nom complet
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
