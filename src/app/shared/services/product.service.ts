import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IProduct } from 'src/app/core/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8085/products'

  constructor(private _httpClient: HttpClient) { }

  public getAllProducts(): Observable<IProduct[]> {
    return this._httpClient.get<IProduct[]>(`${this.baseUrl}`);
  }

  public getProductById(id: number): Observable<IProduct>{
    return this._httpClient.get<IProduct>(`${this.baseUrl}/${id}`);
  }

  public newProduct(product: IProduct): Observable<IProduct>{
    return this._httpClient.post<IProduct>(`${this.baseUrl}`, product);
  }

  public updateProduct(id: number, product: IProduct): Observable<IProduct>{
    return this._httpClient.put<IProduct>(`${this.baseUrl}/${id}`, product);
  }

  public setStatus(id: number): Observable<any>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }
  
  public deleteProduct(id: number): Observable<any> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  

  public addStock(id: number, stock: number): Observable<any> {
    return this._httpClient.put(`${this.baseUrl}/add/${id}/${stock}`, null, { responseType: 'text' });
  }
  
}
