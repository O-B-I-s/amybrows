import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormArray,
} from '@angular/forms';
import { ServiceDescription, ServiceCreateInput } from '../../models';
import { DescriptionService } from '../../services/description.service';
import { ServiceService } from '../../services/service.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-services-crud',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './services-crud.component.html',
  styleUrl: './services-crud.component.css',
})
export class ServicesCrudComponent implements OnInit {
  list: any[] = [];
  descs: ServiceDescription[] = [];
  form: FormGroup;
  editingId?: number;

  constructor(
    private svc: ServiceService,
    private descSvc: DescriptionService,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      title: ['', Validators.required],
      subhead: ['', Validators.required],
      image: [null],
      descriptionIds: fb.array([], Validators.required),
    });
  }

  get descriptionIds() {
    return this.form.get('descriptionIds') as FormArray;
  }

  ngOnInit() {
    this.load();
    this.descSvc.getAll().subscribe((x) => (this.descs = x));
  }

  load() {
    this.svc.getAll().subscribe((x) => {
      this.list = x;
      // whenever services reload, clears out any now-invalid selections
      const used = this.getAllAssignedDescIds();
      // removing from FormArray any id no longer available
      this.descriptionIds.controls = this.descriptionIds.controls.filter(
        (c) => !used.has(c.value) || this.isCurrentlyEditing(c.value)
      );
    });
  }

  fileChange(event: any) {
    const file: File = event.target.files[0];
    if (file) this.form.patchValue({ image: file });
  }

  edit(s: any) {
    this.editingId = s.id;
    this.form.patchValue({
      title: s.title,
      subhead: s.subhead,
    });
    // reset checkboxes
    this.descriptionIds.clear();
    s.descriptions.forEach((d: any) =>
      this.descriptionIds.push(this.fb.control(d.id))
    );
  }

  delete(id: number) {
    this.svc.remove(id).subscribe(() => this.load());
  }

  save() {
    if (!this.form.valid) return;
    const val = this.form.value as ServiceCreateInput;
    const obs = this.editingId
      ? this.svc.update(this.editingId, val)
      : this.svc.create(val);
    obs.subscribe(() => {
      this.form.reset();
      this.descriptionIds.clear();
      this.editingId = undefined;
      this.load();
    });
  }

  // all desc IDs assigned across all services
  getAllAssignedDescIds(): Set<number> {
    const s = new Set<number>();
    this.list.forEach((svc) => {
      svc.descriptions.forEach((d: ServiceDescription) => s.add(d.id));
    });
    return s;
  }

  // allow editing service to keep its own previously selected ones
  isCurrentlyEditing(descId: number) {
    if (!this.editingId) return false;
    const svc = this.list.find((s) => s.id === this.editingId);
    return svc?.descriptions.some((d: any) => d.id === descId);
  }

  onCheckboxChange(e: any, id: number) {
    if (e.target.checked) {
      this.descriptionIds.push(this.fb.control(id));
    } else {
      const idx = this.descriptionIds.controls.findIndex((c) => c.value === id);
      if (idx >= 0) this.descriptionIds.removeAt(idx);
    }
  }
}
