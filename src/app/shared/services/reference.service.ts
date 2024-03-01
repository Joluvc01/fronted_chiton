import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IReference } from 'src/app/core/models/reference.model';

@Injectable({
  providedIn: 'root'
})
export class ReferenceService {

  private baseUrl = 'http://localhost:8085/references'

  constructor(private _httpClient: HttpClient) { }

  public getAllReferences(): Observable<IReference[]> {
    return this._httpClient.get<IReference[]>(`${this.baseUrl}`);
  }

  public getReferenceById(id: number): Observable<IReference>{
    return this._httpClient.get<IReference>(`${this.baseUrl}/${id}`);
  }

  public newReferences(reference: IReference): Observable<IReference>{
    return this._httpClient.post<IReference>(`${this.baseUrl}`, reference);
  }

  public updateReferences(id: number, reference: IReference): Observable<IReference>{
    return this._httpClient.put<IReference>(`${this.baseUrl}/${id}`, reference);
  }

  public setStatus(id: number): Observable<string>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }
  
  public deleteReferences(id: number): Observable<string> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  

  uploadImage(id: number, file: File): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this._httpClient.post(`${this.baseUrl}/upload-image/${id}`, formData, { responseType: 'text' });
  }
}
