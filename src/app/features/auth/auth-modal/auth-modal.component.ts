import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { LoginRequest, RegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css']
})
export class AuthModalComponent implements OnInit {

  // Mode initial reçu depuis la navbar ('connexion' ou 'inscription')
  @Input() modeInitial: 'connexion' | 'inscription' = 'connexion';

  // Événements envoyés vers la navbar
  @Output() fermer   = new EventEmitter<void>();
  @Output() connecte = new EventEmitter<void>();

  // Mode actif dans le modal
  mode: 'connexion' | 'inscription' = 'connexion';

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  registerData: RegisterRequest = {
    username: '',
    fullname: '',
    gender: 'male',
    email: '',
    password: ''
  };
  confirmPassword: string = '';

  chargement          = false;
  erreur              = '';
  succes              = '';
  motDePasseVisible   = false;
  confirmVisible      = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Appliquer le mode initial passé par la navbar
    this.mode = this.modeInitial;
  }

  // ─── BASCULER CONNEXION / INSCRIPTION ─────────────────────────
  basculerMode(mode: 'connexion' | 'inscription'): void {
    this.mode = mode;
    this.erreur = '';
    this.succes = '';
    this.reinitialiserFormulaires();
  }

  // ─── SOUMETTRE CONNEXION ──────────────────────────────────────
  onConnexion(): void {
    this.erreur = '';

    // Validation basique
    if (!this.loginData.email || !this.loginData.password) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }

    this.chargement = true;

    this.authService.connecter(this.loginData).subscribe({
      next: () => {
        this.chargement = false;
        this.succes = 'Connexion réussie ! Bienvenue 👋';
        // Attendre 1 seconde puis fermer le modal
        setTimeout(() => {
          this.connecte.emit();
          this.fermer.emit();
        }, 1000);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || 'Email ou mot de passe incorrect.';
      }
    });
  }

  //soumettre inscription
  onInscription(): void {
    this.erreur = '';

    // Validation de tous les champs
    if (!this.registerData.username || !this.registerData.fullname ||
        !this.registerData.email    || !this.registerData.password  ||
        !this.confirmPassword) {
      this.erreur = 'Veuillez remplir tous les champs.';
      return;
    }

    // Vérifier que les mots de passe correspondent
    if (this.registerData.password !== this.confirmPassword) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }

    // Vérifier la longueur minimale
    if (this.registerData.password.length < 6) {
      this.erreur = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }

    this.chargement = true;

    this.authService.inscrire(this.registerData).subscribe({
      next: () => {
        this.chargement = false;
        this.succes = 'Compte créé avec succès ! Bienvenue 🎉';
        setTimeout(() => {
          this.connecte.emit();
          this.fermer.emit();
        }, 1000);
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || 'Erreur lors de la création du compte.';
      }
    });
  }

  // fermer le modal si clic en dehors du contenu

  onFermer(event?: Event): void {
    if (!event || event.target === event.currentTarget) {
      this.fermer.emit();
    }
  }

  // getters pour validation en temps réel dans le template
  get passwordsCorrespondent(): boolean {
    return this.registerData.password === this.confirmPassword
      && this.confirmPassword.length > 0;
  }

  get passwordAssezLong(): boolean {
    return this.registerData.password.length >= 6;
  }

  // renitialiser les données du formulaire et les états UI
  private reinitialiserFormulaires(): void {
    this.loginData        = { email: '', password: '' };
    this.registerData     = { username: '', fullname: '', gender: 'male', email: '', password: '' };
    this.confirmPassword  = '';
    this.motDePasseVisible = false;
    this.confirmVisible   = false;
  }
}
