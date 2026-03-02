import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-google-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; background: linear-gradient(135deg, #6c63ff22, #fff);
      font-family: Arial, sans-serif;
    ">
      <div style="text-align: center; padding: 40px;">
        <div style="font-size: 64px; margin-bottom: 16px;">🏬</div>
        <h2 style="color: #6c63ff; margin-bottom: 8px;">Connexion Google</h2>
        <p style="color: #888;">Authentification en cours, veuillez patienter...</p>
        <div style="
          margin-top: 24px; width: 40px; height: 40px;
          border: 4px solid #e0e0e0; border-top-color: #6c63ff;
          border-radius: 50%; animation: spin 0.8s linear infinite;
          margin-left: auto; margin-right: auto;
        "></div>
      </div>
      <style>
        @keyframes spin { to { transform: rotate(360deg); } }
      </style>
    </div>
  `
})
export class GoogleCallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer les paramètres envoyés par le backend dans l'URL
    this.route.queryParams.subscribe(params => {
      const { token, role, username, fullname, id } = params;

      if (token && username) {
        // Sauvegarder la session
        this.authService.traiterCallbackGoogle(token, role, username, fullname, id);

        // Rediriger selon le rôle
        if (role === 'admin') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        // Échec → rediriger vers l'accueil
        console.error('Callback Google : paramètres manquants');
        this.router.navigate(['/']);
      }
    });
  }
}
