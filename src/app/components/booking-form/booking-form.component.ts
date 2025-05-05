import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AppointmentService } from '../../services/appointment.service';

@Component({
  selector: 'app-booking-form',
  imports: [ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css',
})
export class BookingFormComponent {
  bookingForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private appointmentService: AppointmentService
  ) {
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      browsService: [null],
      lashesService: [null],
      message: [''],
    });
  }

  onSubmit() {
    if (this.bookingForm.invalid) return;
    this.loading = true;

    this.appointmentService.bookAppointment(this.bookingForm.value).subscribe({
      next: () => {
        alert('✓ Appointment booked! Check your email for confirmation.');
        this.bookingForm.reset();
        this.loading = false;
      },
      error: () => {
        alert('⚠️ Something went wrong. Please try again.');
        this.loading = false;
      },
    });
  }
}
