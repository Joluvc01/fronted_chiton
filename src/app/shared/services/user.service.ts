import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IRegister } from 'src/app/core/models/register.model';
import { IUser } from 'src/app/core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8085/users'

  constructor(private _httpClient: HttpClient) { }

  public getAllUsers(): Observable<IUser[]> {
    return this._httpClient.get<IUser[]>(`${this.baseUrl}`);
  }

  public getUserById(id: number): Observable<IUser>{
    return this._httpClient.get<IUser>(`${this.baseUrl}/${id}`);
  }

  public newUser(user: IRegister): Observable<IRegister>{
    return this._httpClient.post<IRegister>(`${this.baseUrl}`, user);
  }

  public updateUser(id: number, user: IUser): Observable<IUser>{
    return this._httpClient.put<IUser>(`${this.baseUrl}/${id}`, user);
  }

  public setStatus(id: number): Observable<string>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }
  
  public deleteUser(id: number): Observable<string> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  
  
  public checkUserExists(name: string): Observable<boolean> {
    return this._httpClient.get<boolean>(`${this.baseUrl}/exist/${name}`);
  }

  public changePassword(id: number, password: string): Observable<string> {
    return this._httpClient.post<string>(`${this.baseUrl}/change-password/${id}`, password);
  }
}
