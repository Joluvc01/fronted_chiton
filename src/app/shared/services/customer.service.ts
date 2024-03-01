import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ICustomer } from 'src/app/core/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private baseUrl = 'http://localhost:8085/customers'

  constructor(private _httpClient: HttpClient) { }

  public getAllCustomers(): Observable<ICustomer[]> {
    return this._httpClient.get<ICustomer[]>(`${this.baseUrl}`);
  }

  public getCustomerById(id: number): Observable<ICustomer>{
    return this._httpClient.get<ICustomer>(`${this.baseUrl}/${id}`);
  }

  public newCustomer(customer: ICustomer): Observable<ICustomer>{
    return this._httpClient.post<ICustomer>(`${this.baseUrl}`, customer);
  }

  public updateCustomer(id: number, customer: ICustomer): Observable<ICustomer>{
    return this._httpClient.put<ICustomer>(`${this.baseUrl}/${id}`, customer);
  }

  public setStatus(id: number): Observable<string>{
    return this._httpClient.post(`${this.baseUrl}/status/${id}`,null, { responseType: 'text' });
  }
  
  public deleteCustomer(id: number): Observable<string> {
    return this._httpClient.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }  
  
  public checkCustomerExists(name: string): Observable<boolean> {
    return this._httpClient.get<boolean>(`${this.baseUrl}/exist/${name}`);
  }
}
