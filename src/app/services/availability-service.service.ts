import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { environment } from '../../environment/environment';

interface NestedTimeSlot {
  id: number;
  startTime: string;
  endTime: string;
  isTaken: boolean;
}

interface NestedAvailability {
  id: number;
  date: string;
  timeSlots: NestedTimeSlot[];
}

/**
 * A “flat” version of each individual hour‐slot:
 */
export interface FlatSlot {
  parentId: number;

  start: Date;

  end: Date;
}

@Injectable({ providedIn: 'root' })
export class AvailabilityServiceService {
  private readonly apiUrl = environment.apiUrl +'/Availability';

  constructor(private http: HttpClient) {}

  /**
   * Fetches nested AvailabilitySlot[] from the API, then flattens into FlatSlot[].
   * Important: we parse parent.date by splitting off the "YYYY-MM-DD" portion
   * and constructing a local midnight date, so that adding hours is correct.
   */
  getAvailableSlots(): Observable<FlatSlot[]> {
    return this.http.get<NestedAvailability[]>(this.apiUrl).pipe(
      map((nestedArr) => {
        const flats: FlatSlot[] = [];

        nestedArr.forEach((parent) => {
          // Parse date as UTC
          const parentDate = new Date(parent.date);
          const y = parentDate.getUTCFullYear();
          const m = parentDate.getUTCMonth();
          const d = parentDate.getUTCDate();

          parent.timeSlots.forEach((ts) => {
            if (!ts.isTaken) {
              // Parse times as UTC
              const [hS, mS, sS] = ts.startTime.split(':').map(Number);
              const [hE, mE, sE] = ts.endTime.split(':').map(Number);

              // Create UTC dates
              const start = new Date(Date.UTC(y, m, d, hS, mS, sS));
              const end = new Date(Date.UTC(y, m, d, hE, mE, sE));

              flats.push({
                parentId: parent.id,
                start,
                end,
              });
            }
          });
        });

        return flats;
      }),
      tap((flats) => console.log('Fetched slots:', flats))
    );
  }
}
