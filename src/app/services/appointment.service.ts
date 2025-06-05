import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BookingRequest, BookingResponse } from '../models';
import { environment } from '../../environment/environment';

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
  private apiUrl = environment.apiUrl + '/appointments';
  constructor(private http: HttpClient) {}

  /** Client: make a booking */
  book(request: BookingRequest): Observable<BookingResponse> {
    return this.http.post<BookingResponse>(this.apiUrl, request);
  }

  /** Admin: list all bookings (optional) */
  getAll(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(this.apiUrl);
  }
}
