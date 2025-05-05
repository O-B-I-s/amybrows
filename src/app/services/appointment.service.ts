import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Appointment {
  name: string;
  email: string;
  phone: string;
  services: string[];
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private API = '/api/appointments';
  constructor(private http: HttpClient) {}

  bookAppointment(data: Appointment): Observable<any> {
    // your backend must handle sending confirmation emails
    return this.http.post(this.API, data);
  }
}
