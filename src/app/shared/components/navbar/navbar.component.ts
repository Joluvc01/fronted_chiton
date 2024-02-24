import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';
import { faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { filterNavDataByRole } from './nav-data';

interface SideNavToggle {
  collapsed: boolean;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = false;
  navData: any[] = [];
  faClose = faRightFromBracket;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUserLoginOn.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        const role = sessionStorage.getItem('role');
        if (role !== null) {
          this.navData = filterNavDataByRole(role);
        }
      } else {
        this.navData = [];
      }
    });
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({ collapsed: this.collapsed });
  }

  closeSidenav(): void {
    this.collapsed = false;
    this.onToggleSideNav.emit({ collapsed: this.collapsed });
  }

  isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  logout() {
    Swal.fire({
      title: '¿Está seguro de cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authService.logout();
        this.router.navigateByUrl('/login');
      }
    });
  }
}
