import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="reset-page">
      <div class="reset-card">

        <div class="reset-header">
          <div class="reset-logo">🏬</div>
          <h2>Nouveau mot de passe</h2>
          <p>Choisissez un mot de passe sécurisé pour votre compte</p>
        </div>

        <div class="alerte-succes" *ngIf="succes">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ succes }}
          <a routerLink="/" class="btn-accueil">← Retour à l'accueil</a>
        </div>

        <div *ngIf="!succes">

          <div class="alerte-erreur" *ngIf="erreur">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ erreur }}
          </div>

          <div class="champ-groupe">
            <label>Nouveau mot de passe</label>
            <input type="password" [(ngModel)]="password" name="password"
                   placeholder="Au moins 6 caractères"
                   class="champ-input" />
          </div>

          <div class="champ-groupe">
            <label>Confirmer le mot de passe</label>
            <input type="password" [(ngModel)]="confirm" name="confirm"
                   placeholder="Répétez votre mot de passe"
                   class="champ-input"
                   [class.valide]="passwordsCorrespondent"
                   [class.invalide]="confirm.length > 0 && !passwordsCorrespondent" />
          </div>

          <button class="btn-principal" [disabled]="chargement" (click)="onSubmit()">
            <span *ngIf="!chargement">🔐 Réinitialiser le mot de passe</span>
            <span *ngIf="chargement">Réinitialisation en cours...</span>
          </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .reset-page {
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: linear-gradient(135deg, #f5f3ff, #fff);
      font-family: Arial, sans-serif; padding: 24px;
    }
    .reset-card {
      background: white; padding: 40px; border-radius: 20px;
      box-shadow: 0 8px 32px rgba(108,99,255,0.12);
      width: 100%; max-width: 440px;
    }
    .reset-header { text-align: center; margin-bottom: 32px; }
    .reset-logo { font-size: 48px; margin-bottom: 12px; }
    .reset-header h2 { color: #333; margin: 0 0 8px; font-size: 24px; }
    .reset-header p { color: #888; margin: 0; font-size: 14px; }
    .champ-groupe { margin-bottom: 16px; }
    .champ-groupe label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 600; color: #555; }
    .champ-input {
      width: 100%; padding: 12px 16px; border: 2px solid #e8e8e8;
      border-radius: 10px; font-size: 14px; box-sizing: border-box;
      transition: border-color 0.2s;
    }
    .champ-input:focus { outline: none; border-color: #6c63ff; }
    .champ-input.valide { border-color: #28a745; }
    .champ-input.invalide { border-color: #dc3545; }
    .btn-principal {
      width: 100%; padding: 14px; background: linear-gradient(135deg, #6c63ff, #5a52d5);
      color: white; border: none; border-radius: 10px; font-size: 15px;
      font-weight: 600; cursor: pointer; margin-top: 8px; transition: opacity 0.2s;
    }
    .btn-principal:disabled { opacity: 0.7; cursor: not-allowed; }
    .alerte-succes {
      background: #d4edda; color: #155724; padding: 16px; border-radius: 10px;
      margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px; align-items: flex-start;
    }
    .alerte-erreur {
      background: #f8d7da; color: #721c24; padding: 12px 16px; border-radius: 10px;
      margin-bottom: 16px; display: flex; align-items: center; gap: 8px; font-size: 14px;
    }
    .btn-accueil { color: #155724; font-weight: 600; text-decoration: none; }
    .btn-accueil:hover { text-decoration: underline; }
  `]
})
export class ResetPasswordComponent implements OnInit {

  password   = '';
  confirm    = '';
  chargement = false;
  erreur     = '';
  succes     = '';
  private token = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private cdr: ChangeDetectorRef  // ← ajout
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.params['token'];
    if (!this.token) {
      this.erreur = 'Lien invalide. Veuillez refaire une demande de réinitialisation.';
    }
  }

  get passwordsCorrespondent(): boolean {
    return this.password === this.confirm && this.confirm.length > 0;
  }

  onSubmit(): void {
    this.erreur = '';
    if (!this.password || !this.confirm) {
      this.erreur = 'Veuillez remplir les deux champs.';
      return;
    }
    if (this.password !== this.confirm) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }
    if (this.password.length < 6) {
      this.erreur = 'Le mot de passe doit contenir au moins 6 caractères.';
      return;
    }
    this.chargement = true;
    this.authService.reinitialiserMotDePasse(this.token, this.password).subscribe({
      next: () => {
        this.chargement = false;
        this.succes = 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.';
        this.cdr.detectChanges(); // ← ajout
      },
      error: (err) => {
        this.chargement = false;
        this.erreur = err.error?.message || 'Lien invalide ou expiré. Veuillez refaire une demande.';
        this.cdr.detectChanges(); // ← ajout
      }
    });
  }
}
