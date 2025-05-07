import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GalleryItem } from '../../models';
import { GalleryService } from '../../services/gallery.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-crud',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './gallery-crud.component.html',
  styleUrl: './gallery-crud.component.css',
})
export class GalleryCrudComponent implements OnInit {
  list: GalleryItem[] = [];
  form: FormGroup;
  editingId?: number;

  constructor(private fb: FormBuilder, private gallerySvc: GalleryService) {
    this.form = this.fb.group({
      before: [null],
      after: [null],
    });
  }

  ngOnInit() {
    this.load();
  }
  load() {
    this.gallerySvc.getAll().subscribe((x) => (this.list = x));
  }

  fileChange(ctrl: 'before' | 'after', e: any) {
    const file: File = e.target.files[0];
    if (file) this.form.patchValue({ [ctrl]: file });
  }

  edit(item: GalleryItem) {
    this.editingId = item.id;
  }

  delete(id: number) {
    this.gallerySvc.remove(id).subscribe(() => this.load());
  }

  save() {
    const v = this.form.value;
    const obs = this.editingId
      ? this.gallerySvc.update(this.editingId, v)
      : this.gallerySvc.create(v);
    obs.subscribe(() => {
      this.form.reset();
      this.editingId = undefined;
      this.load();
    });
  }
}
