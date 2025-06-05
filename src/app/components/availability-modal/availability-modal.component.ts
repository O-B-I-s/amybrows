import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import {
  AvailabilityServiceService,
  FlatSlot,
} from '../../services/availability-service.service';
import { map } from 'rxjs';

interface GroupedSlots {
  [date: string]: Date[];
}

@Component({
  selector: 'app-availability-modal',
  standalone: true,
  imports: [CommonModule, MatDialogModule],
  templateUrl: './availability-modal.component.html',
  styleUrls: ['./availability-modal.component.css'],
})
export class AvailabilityModalComponent implements OnInit {
  public groupSlots: GroupedSlots = {};
  public sortedDates: string[] = [];

  constructor(
    private availabilitySvc: AvailabilityServiceService,
    private dialogRef: MatDialogRef<AvailabilityModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.availabilitySvc
      .getAvailableSlots()
      .pipe(
        map((flatSlots: FlatSlot[]) => {
          const groups: GroupedSlots = {};
          flatSlots.forEach((slot) => {
            // Use UTC date for grouping
            const utcDate = new Date(
              Date.UTC(
                slot.start.getUTCFullYear(),
                slot.start.getUTCMonth(),
                slot.start.getUTCDate()
              )
            );
            const dateKey = utcDate.toISOString().split('T')[0];

            if (!groups[dateKey]) {
              groups[dateKey] = [];
            }

            // Store the original UTC time
            groups[dateKey].push(slot.start);
          });

          Object.keys(groups).forEach((d) => {
            groups[d].sort((a, b) => a.getTime() - b.getTime());
          });

          return groups;
        })
      )
      .subscribe({
        next: (grouped) => {
          this.groupSlots = grouped;
          this.sortedDates = Object.keys(grouped).sort(
            (a, b) => new Date(a).getTime() - new Date(b).getTime()
          );
        },
        error: (err) => {
          console.error('Failed to load availability for modal:', err);
        },
      });
  }

  // Format time in UTC
  formatUTCTime(date: Date): string {
    return `${date.getUTCHours().toString().padStart(2, '0')}:${date
      .getUTCMinutes()
      .toString()
      .padStart(2, '0')}`;
  }

  // Format date in UTC
  formatUTCDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      timeZone: 'UTC',
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  close() {
    this.dialogRef.close();
  }
}
