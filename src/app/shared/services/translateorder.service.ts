import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ITranslateOrder } from 'src/app/core/models/translateorder.model';

@Injectable({
  providedIn: 'root'
})
export class TranslateorderService {

  private baseUrl = 'http://localhost:8085/translateOrders'

  constructor(private _httpClient: HttpClient) { }

  public getAllTranslates(): Observable<ITranslateOrder[]> {
    return this._httpClient.get<ITranslateOrder[]>(`${this.baseUrl}`);
  }

  public getTranslateById(id: number): Observable<ITranslateOrder>{
    return this._httpClient.get<ITranslateOrder>(`${this.baseUrl}/${id}`);
  }

  public newTranslate(translate: ITranslateOrder): Observable<ITranslateOrder>{
    return this._httpClient.post<ITranslateOrder>(`${this.baseUrl}`, translate);
  }

  public updateTranslate(id: number, translate: ITranslateOrder): Observable<ITranslateOrder>{
    return this._httpClient.put<ITranslateOrder>(`${this.baseUrl}/${id}`, translate);
  }

  public setStatus(id: number): Observable<string>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }
  
  public deleteTranslate(id: number): Observable<string> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  
  
}
