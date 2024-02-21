import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';


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

  logout() {
    Swal.fire({
      title: "¿Está seguro de cerrar sesión?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí",
      cancelButtonText: "No"
    }).then((result) => {
      if (result.isConfirmed) {
        this.service.logout();
        this.router.navigateByUrl('/login');
      }
    });
  }
  

  hasRole(role: string): boolean {
    const userRole = sessionStorage.getItem('role');
    return userRole === role;
}
}