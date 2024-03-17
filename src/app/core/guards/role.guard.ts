import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(next: ActivatedRouteSnapshot): Observable<boolean> | boolean {
    const roles = next.data['roles'] as string[]; 
    const loggedIn = this.authService.isLogin();
    
    if (loggedIn){
      if (roles && roles.length > 0) {
        const role = localStorage.getItem("role");
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
  }
}
