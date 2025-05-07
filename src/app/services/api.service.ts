import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly API = 'https://localhost:7142/api';
  constructor(protected http: HttpClient) {}

  protected get<T>(url: string) {
    return this.http.get<T>(`${this.API}/${url}`);
  }
  protected post<T>(url: string, body: any) {
    return this.http.post<T>(`${this.API}/${url}`, body);
  }
  protected put<T>(url: string, body: any) {
    return this.http.put<T>(`${this.API}/${url}`, body);
  }
  protected delete<T>(url: string) {
    return this.http.delete<T>(`${this.API}/${url}`);
  }
}
