import { Injectable } from '@angular/core';
import { GalleryItem } from '../models';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GalleryService extends ApiService {
  getAll(): Observable<GalleryItem[]> {
    return this.get<GalleryItem[]>('gallery');
  }
  getId(id: number): Observable<GalleryItem> {
    return this.get<GalleryItem>(`gallery/${id}`);
  }

  create(item: { before: File; after: File }): Observable<GalleryItem> {
    const form = new FormData();
    form.append('beforeImage', item.before);
    form.append('afterImage', item.after);
    return this.post<GalleryItem>('gallery', form);
  }

  update(
    id: number,
    item: { before?: File; after?: File }
  ): Observable<GalleryItem> {
    const form = new FormData();
    if (item.before) form.append('beforeImage', item.before);
    if (item.after) form.append('afterImage', item.after);
    return this.put<GalleryItem>(`gallery/${id}`, form);
  }

  remove(id: number): Observable<void> {
    return this.delete<void>(`gallery/${id}`);
  }
}
