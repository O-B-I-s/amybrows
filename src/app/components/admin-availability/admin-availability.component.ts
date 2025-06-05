import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError, map, of } from 'rxjs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { environment } from '../../../environment/environment';

/**
 * Adjusted to match lower-camelCase from the API.
 * Check your console.log(...) from fetchAllAvailability to confirm.
 */
interface TimeSlot {
  startTime: string; // was StartTime
  endTime: string; // was EndTime
  isTaken: boolean; // was IsTaken
}

interface AvailabilitySlot {
  id?: number;
  date: string; // was Date
  timeSlots?: TimeSlot[]; // was TimeSlots
}

@Component({
  selector: 'app-admin-availability',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
  ],
  templateUrl: './admin-availability.component.html',
  styleUrls: ['./admin-availability.component.css'],
})
export class AdminAvailabilityComponent implements OnInit {
  private readonly apiUrl = environment.apiUrl + '/Availability';

  form!: FormGroup;
  public availabilitySlots: AvailabilitySlot[] = [];
  public loading = false;
  public errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchAllAvailability();
  }

  initializeForm() {
    this.form = this.fb.group({
      selectedDate: new FormControl<Date | null>(null, Validators.required),
      startTime: ['09:00', Validators.required],
      endTime: ['17:00', Validators.required],
    });
  }

  save() {
    if (this.form.invalid) {
      alert('Please pick a date and set a valid time range.');
      return;
    }

    const payload = this.transformFormData();
    this.http.post(this.apiUrl, payload).subscribe({
      next: () => {
        alert('Availability saved successfully!');
        this.fetchAllAvailability();
        this.form.reset({
          startTime: '09:00',
          endTime: '17:00',
          selectedDate: null,
        });
      },
      error: (err) => {
        console.error('Save error:', err);
        alert('Error saving availability: ' + err.message);
      },
    });
  }

  private transformFormData(): any[] {
    const dateObj: Date = this.form.value.selectedDate!;
    const { startTime, endTime } = this.form.value;

    // Build one slot with lower-camelCase property names
    return [
      {
        date: dateObj.toISOString().split('T')[0], // e.g. "2025-06-10"
        timeSlots: this.buildTimeSlots(startTime, endTime),
      },
    ];
  }

  private buildTimeSlots(startTime: string, endTime: string): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const startHour = parseInt(startTime.split(':')[0], 10);
    const endHour = parseInt(endTime.split(':')[0], 10);

    for (let hour = startHour; hour < endHour; hour++) {
      slots.push({
        startTime: this.formatTime(hour, 0),
        endTime: this.formatTime(hour + 1, 0),
        isTaken: false,
      });
    }
    return slots;
  }

  private formatTime(hours: number, minutes: number): string {
    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    return `${hh}:${mm}:00`;
  }

  fetchAllAvailability(): void {
    this.loading = true;
    this.errorMessage = null;

    this.http
      .get<AvailabilitySlot[]>(this.apiUrl)
      .pipe(
        map((slots) =>
          // Sort by date string
          slots.sort((a, b) => {
            const da = new Date(a.date).getTime();
            const db = new Date(b.date).getTime();
            return da - db;
          })
        ),
        catchError((err) => {
          console.error('Fetch error:', err);
          this.errorMessage = 'Could not load availability. Please try again.';
          this.loading = false;
          return of<AvailabilitySlot[]>([]);
        })
      )
      .subscribe((sortedSlots) => {
        console.log('Fetched availabilitySlots:', sortedSlots);
        this.availabilitySlots = sortedSlots;
        this.loading = false;
      });
  }

  deleteSlot(id: number | undefined): void {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this date's availability?")) {
      return;
    }
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.availabilitySlots = this.availabilitySlots.filter(
          (s) => s.id !== id
        );
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Could not delete slot. Try again.');
      },
    });
  }
}
