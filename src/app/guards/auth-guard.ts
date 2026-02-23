import { CanActivateFn } from '@angular/router';
import { AuthService } from '../features/auth/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.estConnecte()) return true;

  router.navigate(['/']);
  return false;
};
