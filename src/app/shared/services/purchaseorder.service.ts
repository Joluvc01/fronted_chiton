import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IPurchaseOrder } from 'src/app/core/models/purchaseorder.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseorderService {

  private baseUrl = 'http://localhost:8085/purchaseOrders'

  constructor(private _httpClient: HttpClient) { }

  public getAllPurchaseOrders(): Observable<IPurchaseOrder[]> {
    return this._httpClient.get<IPurchaseOrder[]>(`${this.baseUrl}`);
  }

  public getPurchaseOrderById(id: number): Observable<IPurchaseOrder>{
    return this._httpClient.get<IPurchaseOrder>(`${this.baseUrl}/${id}`);
  }

  public newPurchaseOrders(purchase: IPurchaseOrder): Observable<IPurchaseOrder>{
    return this._httpClient.post<IPurchaseOrder>(`${this.baseUrl}`, purchase);
  }

  public updatePurchaseOrders(id: number, purchase: IPurchaseOrder): Observable<IPurchaseOrder>{
    return this._httpClient.put<IPurchaseOrder>(`${this.baseUrl}/${id}`, purchase);
  }

  public setStatus(id: number): Observable<string>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }
  
  public deletePurchaseOrders(id: number): Observable<string> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  
}
