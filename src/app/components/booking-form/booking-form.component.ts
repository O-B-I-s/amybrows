import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import {
  AvailabilityServiceService,
  FlatSlot,
} from '../../services/availability-service.service';
import { AppointmentService } from '../../services/appointment.service';
import { BookingRequest } from '../../models';
import { HttpClientModule } from '@angular/common/http';

import { AvailabilityModalComponent } from '../availability-modal/availability-modal.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export const atLeastOneServiceSelectedValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const formArray = control as FormArray;
    const atLeastOneChecked = formArray.controls.some(
      (ctrl) => ctrl.value === true
    );
    return atLeastOneChecked ? null : { required: true };
  };
};

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    MatDialogModule,
    MatInputModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatDatepicker,
  ],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css'],
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  allSlots: FlatSlot[] = [];
  availableTimes: Date[] = [];
  loading = false;
  submissionSuccess = false;
  submissionError: string | null = null;
  minDate: Date = new Date();

  /** Define every service option in one array */
  allServices = [
    { name: 'ombre-powder-brows', label: 'Ombré Powder Brows — $300' },
    { name: 'microblading', label: 'Microblading — $300' },
    { name: 'combo-brows', label: 'Combo Brows — $350' },
    { name: 'brow-lamination', label: 'Brow Lamination — $30' },
    { name: 'classic-lashes', label: 'Classic Lashes — $65' },
    { name: 'hybrid-lashes', label: 'Hybrid Lashes — $75' },
    { name: 'volume-lashes', label: 'Volume Lashes — $85' },
    { name: 'mega-volume-lashes', label: 'Mega Volume Lashes — $95' },
  ];

  constructor(
    private fb: FormBuilder,
    private availabilitySvc: AvailabilityServiceService,
    private bookingSvc: AppointmentService,
    private dialog: MatDialog
  ) {
    // Build the form group:
    // - name, email, phone, date, timeSlot, message
    // - services: a FormArray of booleans (one per each allServices entry)
    this.bookingForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      services: this.fb.array(
        this.allServices.map(() => this.fb.control(false)),
        atLeastOneServiceSelectedValidator()
      ),

      date: ['', Validators.required],
      timeSlot: [null, Validators.required],
      message: [''],
    });
  }

  ngOnInit() {
    console.log('Component initialized');

    this.availabilitySvc.getAvailableSlots().subscribe({
      next: (flatSlots) => {
        console.log('Received slots:', flatSlots);
        this.allSlots = flatSlots;
      },
      error: (err) => {
        console.error('Failed to load availability:', err);
      },
    });

    this.bookingForm
      .get('date')
      ?.valueChanges.subscribe((date: Date | null) => {
        console.log('Date changed:', date);
        if (date) {
          this.onDateChange(date);
        } else {
          this.availableTimes = [];
          this.bookingForm.get('timeSlot')?.reset();
        }
      });
  }

  get servicesArray(): FormArray {
    return this.bookingForm.get('services') as FormArray;
  }

  onDateChange(selectedDate: Date) {
    this.availableTimes = [];
    if (!selectedDate) return;

    // Convert to "UTC midnight" so we can filter slots by UTC date
    const utcDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );

    // Filter the flat slots which match that exact UTC date
    this.availableTimes = this.allSlots
      .filter((slot) => {
        const slotDate = new Date(slot.start);
        return (
          slotDate.getUTCFullYear() === utcDate.getUTCFullYear() &&
          slotDate.getUTCMonth() === utcDate.getUTCMonth() &&
          slotDate.getUTCDate() === utcDate.getUTCDate()
        );
      })
      .map((slot) => slot.start)
      .sort((a, b) => a.getTime() - b.getTime());

    console.log('Available times:', this.availableTimes);
    this.bookingForm.get('timeSlot')?.reset();
  }

  openAvailabilityModal() {
    this.dialog.open(AvailabilityModalComponent, {
      width: '600px',
      maxHeight: '80vh',
      data: {},
    });
  }

  onSubmit() {
    if (this.bookingForm.invalid) return;

    this.loading = true;
    this.submissionError = null;

    const val = this.bookingForm.value;
    const timeSlot: Date = val.timeSlot;

    // Find matching slot
    const matched = this.allSlots.find(
      (s) => s.start.getTime() === timeSlot.getTime()
    );

    if (!matched) {
      this.submissionError = 'Selected time-slot is no longer available.';
      this.loading = false;
      return;
    }

    // Build UTC dates for submission
    const startUtc = new Date(
      Date.UTC(
        matched.start.getUTCFullYear(),
        matched.start.getUTCMonth(),
        matched.start.getUTCDate(),
        matched.start.getUTCHours(),
        matched.start.getUTCMinutes(),
        matched.start.getUTCSeconds()
      )
    );
    const endUtc = new Date(
      Date.UTC(
        matched.end.getUTCFullYear(),
        matched.end.getUTCMonth(),
        matched.end.getUTCDate(),
        matched.end.getUTCHours(),
        matched.end.getUTCMinutes(),
        matched.end.getUTCSeconds()
      )
    );

    // Build array of selected service names
    const selectedServices: string[] = this.servicesArray.value
      .map((checked: boolean, idx: number) =>
        checked ? this.allServices[idx].name : null
      )
      .filter((v: string | null) => v !== null) as string[];

    const request: BookingRequest = {
      name: val.name,
      email: val.email,
      phone: val.phone,
      services: selectedServices,
      startUtc: startUtc.toISOString(),
      endUtc: endUtc.toISOString(),
      message: val.message,
    };

    this.bookingSvc.book(request).subscribe({
      next: () => {
        this.submissionSuccess = true;
        this.loading = false;
        // Remove that slot from allSlots so it cannot be reselected
        this.allSlots = this.allSlots.filter(
          (s) => s.start.getTime() !== timeSlot.getTime()
        );
        this.onDateChange(val.date);
        this.bookingForm.get('timeSlot')?.reset();
      },
      error: (err) => {
        console.error('Booking error:', err);
        this.submissionError =
          err.error?.title || err.error || 'Booking failed.';
        this.loading = false;
      },
    });
  }

  openDatePicker(picker: MatDatepicker<Date>) {
    picker.open();
    const sub = picker.closedStream.subscribe(() => sub.unsubscribe());
  }
}
