import { Component, OnInit } from '@angular/core';
import { ServiceDescription } from '../../models';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DescriptionService } from '../../services/description.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-descriptions-crud',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './descriptions-crud.component.html',
  styleUrl: './descriptions-crud.component.css',
})
export class DescriptionsCrudComponent implements OnInit {
  list: ServiceDescription[] = [];
  form: FormGroup;
  editing?: number;

  constructor(private descSvc: DescriptionService, fb: FormBuilder) {
    this.form = fb.group({
      title: ['', Validators.required],
      item: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.load();
  }
  load() {
    this.descSvc.getAll().subscribe((x) => (this.list = x));
  }

  edit(desc: ServiceDescription) {
    this.editing = desc.id;
    this.form.patchValue(desc);
  }

  delete(id: number) {
    this.descSvc.remove(id).subscribe(() => this.load());
  }

  save() {
    if (!this.form.valid) return;
    const val = this.form.value;
    const obs = this.editing
      ? this.descSvc.update({ id: this.editing, ...val })
      : this.descSvc.create(val);
    obs.subscribe(() => {
      this.editing = undefined;
      this.form.reset();
      this.load();
    });
  }
}
