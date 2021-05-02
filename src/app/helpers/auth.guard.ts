import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { TokenStorageService } from '../services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private tokenStorage: TokenStorageService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.tokenStorage.getToken()) {
      // Si autorisé alors retourne vrai
      return true;
    }

    // Si non connecté alors redirigez vers la page de connexion avec l'URL de retour
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
    return false;
  }
}
