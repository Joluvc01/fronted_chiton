import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/core/models/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private baseUrl = 'http://localhost:8085/categories'

  constructor(private _httpClient: HttpClient) { }

  public getAllCategories(): Observable<ICategory[]> {
    return this._httpClient.get<ICategory[]>(`${this.baseUrl}`);
  }

  public getCategoryById(id: number): Observable<ICategory>{
    return this._httpClient.get<ICategory>(`${this.baseUrl}/${id}`);
  }

  public newCategory(category: ICategory): Observable<ICategory>{
    return this._httpClient.post<ICategory>(`${this.baseUrl}`, category);
  }

  public updateCategory(id: number, category: ICategory): Observable<ICategory>{
    return this._httpClient.put<ICategory>(`${this.baseUrl}/${id}`, category);
  }

  public setStatus(id: number): Observable<string>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }
  
  public deleteCategory(id: number): Observable<string> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  
}
