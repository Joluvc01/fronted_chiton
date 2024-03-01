import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | boolean {
    return this.authService.currentUserLoginOn.pipe(
      map(loggedIn => {
        if (!loggedIn) {
          return true;
        } else {
          this.router.navigate(['']);
          return false;
        }
      })
    );
  }
}
