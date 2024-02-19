import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ILogin } from 'src/app/core/models/login.model';
import { IUser } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8085/categories'

  constructor(private _httpClient: HttpClient) { }

  public login(login: ILogin): Observable<IUser>{
    return this._httpClient.post<IUser>(`${this.baseUrl}`, login);
  }
}
