import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthenticationService } from './auth.service';
@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public authService: AuthenticationService, public router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>  {
    return this.authService.isAuthenticated().pipe(map((response: {status: string,message: string}) => {
        if (response.status === "Authenticated") {
            return true;
        }
        this.router.navigate(['/login', { queryParams: { returnUrl: state.url }}]);
        return false;
    }), catchError((error) => {
        this.router.navigate(['/login', { queryParams: { returnUrl: state.url }}]);
        return of(false);
    }));
    }
}