import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(
    private router: Router,
    private service: AuthService
    ) {}

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout(){
    this.service.logout();
    this.router.navigateByUrl('/login');
  }

  hasRole(role: string): boolean {
    const userRole = sessionStorage.getItem('role');
    return userRole === role;
}
}