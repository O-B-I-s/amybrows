// calendar-availability.component.ts
import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  inject,
} from '@angular/core';
import {
  CalendarEvent,
  CalendarView,
  CalendarModule,
  DateAdapter,
} from 'angular-calendar';
import { startOfDay } from 'date-fns';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

// (This component will open a modal to add new availability.
//  You can implement AddAvailabilityModalComponent separately;
//  for now we assume it returns "refresh" on success.)
@Component({
  selector: 'app-calendar-availability',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    NgbModalModule,
  ],
  templateUrl: './calendar-availability.component.html',
  styleUrls: ['./calendar-availability.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarAvailabilityComponent implements OnInit {
  // Keep track of the current view and viewDate
  view: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  CalendarView = CalendarView; // expose to template
  events: CalendarEvent[] = [];

  private http = inject(HttpClient);
  private modalService = inject(NgbModal);

  ngOnInit(): void {
    this.loadAvailability();
  }

  /**
   * Called when a calendar day cell is clicked.
   * Opens a modal to add availability for that date.
   */
  dayClicked({ date }: { date: Date }): void {
    // Open your custom "AddAvailabilityModalComponent" (make sure you've created it)
    const modalRef = this.modalService.open(AddAvailabilityModalComponent, {
      size: 'lg',
    });
    modalRef.componentInstance.date = date; // pass the clicked date into the modal

    modalRef.result
      .then((result) => {
        if (result === 'refresh') {
          this.loadAvailability();
        }
      })
      .catch(() => {
        // Modal dismissed
      });
  }

  /**
   * Queries GET /api/availability and maps it into `CalendarEvent[]`.
   */
  loadAvailability(): void {
    this.http.get<any[]>('/api/availability').subscribe((res) => {
      // Expect each item to look like:
      // { date: "2025-06-01", timeSlots: [ { startTime:"09:00", endTime:"11:00", ... }, ... ] }
      this.events = res.map((day) => ({
        start: startOfDay(new Date(day.date)),
        title: `${day.timeSlots.length} slot(s)`,
        allDay: true,
        meta: day.timeSlots, // optional: store child timeSlots for deeper use
        color: { primary: '#1e90ff', secondary: '#D1E8FF' },
      }));
    });
  }
}

/**
 * Stub of AddAvailabilityModalComponent.
 * You would implement your own modal to create new AvailabilitySlot + TimeSlots.
 * For this example, it simply returns "refresh" when closed.
 */
@Component({
  selector: 'app-add-availability-modal',
  standalone: true,
  imports: [CommonModule, NgbModalModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title">
        Add Availability for {{ date | date : 'longDate' }}
      </h4>
      <button
        type="button"
        class="btn-close"
        aria-label="Close"
        (click)="modal.dismiss('cancel')"
      ></button>
    </div>
    <div class="modal-body">
      <!-- You can put your form fields here to create multiple TimeSlots -->
      <p>
        Implement a form here to add time slots on
        {{ date | date : 'fullDate' }}.
      </p>
      <p>(E.g. startTime/endTime pickers, etc.)</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="modal.dismiss()">
        Close
      </button>
      <button type="button" class="btn btn-primary" (click)="save()">
        Save
      </button>
    </div>
  `,
})
export class AddAvailabilityModalComponent {
  date!: Date;
  modal = inject(NgbModal);

  save() {
    // Your logic to POST a new AvailabilitySlot (with child TimeSlots)
    // For now we simply close the modal and tell the parent to "refresh"
    this.modal.dismissAll('refresh');
  }
}
