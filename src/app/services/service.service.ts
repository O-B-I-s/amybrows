import { Injectable } from '@angular/core';
import { Service, ServiceCreateInput } from '../models';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ServiceService extends ApiService {
  getAll() {
    return this.get<Service[]>('services');
  }
  getId(id: number) {
    return this.get<Service>(`services/${id}`);
  }

  create(input: ServiceCreateInput) {
    const form = new FormData();
    form.append('title', input.title);
    form.append('subhead', input.subhead);
    if (input.image) {
      form.append('image', input.image);
    }
    input.descriptionIds.forEach((id) =>
      form.append('descriptionIds', id.toString())
    );
    return this.post<Service>('services', form);
  }
  update(id: number, input: ServiceCreateInput) {
    const form = new FormData();
    form.append('title', input.title);
    form.append('subhead', input.subhead);
    if (input.image) form.append('image', input.image);
    input.descriptionIds.forEach((d) =>
      form.append('descriptionIds', d.toString())
    );
    return this.put<Service>(`services/${id}`, form);
  }

  remove(id: number) {
    return this.delete<void>(`services/${id}`);
  }
}
