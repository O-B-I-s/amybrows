import { Component } from '@angular/core';
import { BookingFormComponent } from '../booking-form/booking-form.component';

@Component({
  selector: 'app-book-appointment',
  imports: [BookingFormComponent],
  templateUrl: './book-appointment.component.html',
  styleUrl: './book-appointment.component.css',
})
export class BookAppointmentComponent {}
