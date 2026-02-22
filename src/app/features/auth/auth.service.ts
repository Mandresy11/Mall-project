import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private apiUrl = 'http://localhost:3000/api/auth';

  private utilisateurConnecte = new BehaviorSubject<User | null>(
    this.recupererUtilisateurLocal()
  );

  utilisateur$ = this.utilisateurConnecte.asObservable();

  constructor(private http: HttpClient) {}

  // connexion
  connecter(donnees: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, donnees).pipe(
      tap(reponse => {
        // Sauvegarder le token et l'utilisateur dans localStorage
        localStorage.setItem('token', reponse.token);
        localStorage.setItem('utilisateur', JSON.stringify(reponse.user));
        // Mettre à jour le BehaviorSubject
        this.utilisateurConnecte.next(reponse.user);
      })
    );
  }

  // inscription
  inscrire(donnees: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, donnees).pipe(
      tap(reponse => {
        localStorage.setItem('token', reponse.token);
        localStorage.setItem('utilisateur', JSON.stringify(reponse.user));
        this.utilisateurConnecte.next(reponse.user);
      })
    );
  }

  // déconnexion
  deconnecter(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('utilisateur');
    this.utilisateurConnecte.next(null);
  }

  // utilitaires
  estConnecte(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenirToken(): string | null {
    return localStorage.getItem('token');
  }

  obtenirUtilisateur(): User | null {
    return this.utilisateurConnecte.getValue();
  }

  private recupererUtilisateurLocal(): User | null {
    const data = localStorage.getItem('utilisateur');
    return data ? JSON.parse(data) : null;
  }
}
