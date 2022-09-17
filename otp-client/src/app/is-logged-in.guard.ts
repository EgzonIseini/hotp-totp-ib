import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class IsLoggedInGuard implements CanActivate {

  constructor(private readonly authService: AuthService,
              private readonly router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const userLoggedIn = this.authService.isUserLoggedIn()
    const hasUserEnabled2FA = this.authService.hasUserCompleted2FA()

    if (!this.authService.isUserLoggedIn()) {
      return this.router.parseUrl('/login');
    } else if(!hasUserEnabled2FA) {
      return this.router.parseUrl('/2fa')
    } else {
      return true;
    }
  }

}
