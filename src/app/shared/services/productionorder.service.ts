import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProductionOrder } from 'src/app/core/models/productionorder.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionorderService {

  private baseUrl = 'http://localhost:8085/productionOrders'

  constructor(private _httpClient: HttpClient) { }

  public getAllOp(): Observable<IProductionOrder[]> {
    return this._httpClient.get<IProductionOrder[]>(`${this.baseUrl}`);
  }

  public getOpById(id: number): Observable<IProductionOrder>{
    return this._httpClient.get<IProductionOrder>(`${this.baseUrl}/${id}`);
  }

  public newOp(prod: IProductionOrder): Observable<IProductionOrder>{
    return this._httpClient.post<IProductionOrder>(`${this.baseUrl}`, prod);
  }

  public updateOp(id: number, prod: IProductionOrder): Observable<IProductionOrder>{
    return this._httpClient.put<IProductionOrder>(`${this.baseUrl}/${id}`, prod);
  }

  public setStatus(id: number): Observable<string>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }

  public deleteOp(id: number): Observable<string> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  
}
