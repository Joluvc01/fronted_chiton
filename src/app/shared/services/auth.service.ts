import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { ILogin } from 'src/app/core/models/login.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { 
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null);
  }

  private baseUrl = 'http://localhost:8085/auth'

  login(credentials: ILogin): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}`, credentials).pipe(
      tap(userData => {
        sessionStorage.setItem("token", userData.token);
        sessionStorage.setItem("userId", userData.user.id.toString());
        sessionStorage.setItem("username", userData.user.username);
        sessionStorage.setItem("firstname", userData.user.firstname);
        sessionStorage.setItem("lastname", userData.user.lastname);
        sessionStorage.setItem("status", userData.user.status);
        sessionStorage.setItem("role", userData.user.role);
        this.currentUserLoginOn.next(true);
      }),
      map(userData => userData.token),
    );
  }

  logout():void{
    sessionStorage.clear();
    this.currentUserLoginOn.next(false);
  }
}