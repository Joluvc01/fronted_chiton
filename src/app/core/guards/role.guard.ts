import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    const roles = next.data['roles'] as string[]; 
    return this.authService.currentUserLoginOn.pipe(
      map(loggedIn => {
        if (loggedIn){
          if (roles && roles.length > 0) {
            const role = sessionStorage.getItem("role");
            if (role && roles.includes(role)) {
              return true; 
            } else {
              this.router.navigate(['/error']);
              return false; 
            }
          } else {
            return true;
          }
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
