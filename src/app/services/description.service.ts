import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { ServiceDescription } from '../models';

@Injectable({
  providedIn: 'root',
})
export class DescriptionService extends ApiService {
  getAll() {
    return this.get<ServiceDescription[]>('descriptions');
  }
  getbyId(id: number) {
    return this.get<ServiceDescription>(`descriptions/${id}`);
  }
  create(desc: Partial<ServiceDescription>) {
    return this.post<ServiceDescription>('descriptions', desc);
  }
  update(desc: ServiceDescription) {
    return this.put<ServiceDescription>(`descriptions/${desc.id}`, desc);
  }
  remove(id: number) {
    return this.delete<void>(`descriptions/${id}`);
  }
}
