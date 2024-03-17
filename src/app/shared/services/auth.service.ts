import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ILogin } from 'src/app/core/models/login.model';
import { jwtDecode } from "jwt-decode";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.currentUserLoginOn=new BehaviorSubject<boolean>(this.isLogin());
  }

  private baseUrl = 'http://localhost:8085/auth'

  isLogin(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }
  
    const expiration = localStorage.getItem('exp');
    const expDate = expiration ? new Date(parseInt(expiration)) : new Date();
    if (expDate <= new Date()) {
      Swal.fire({
        title: 'Token Expirado',
        text: 'Su sesión ha expirado. Por favor, vuelva a iniciar sesión.',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK',
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout();
        }
      });
      return false;
    }
    return true;
  }

  login(credentials: ILogin): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, credentials).pipe(
      tap(userData => {
        localStorage.setItem("token", userData.token);
        const payload: any = jwtDecode(userData.token);
        const expirationDate: Date = new Date(payload.exp * 1000);
        localStorage.setItem("exp", expirationDate.getTime().toString());
        localStorage.setItem("role", payload.role);
        localStorage.setItem("firstname", payload.firstname);
        localStorage.setItem("lastname", payload.lastname);
        this.currentUserLoginOn.next(true);
      })
    );
  }

  logout():void{
    localStorage.clear();
    this.currentUserLoginOn.next(false);
  }
}


