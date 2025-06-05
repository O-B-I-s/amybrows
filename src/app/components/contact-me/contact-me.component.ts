import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Contact } from '../../models';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-contact-me',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './contact-me.component.html',
  styleUrl: './contact-me.component.css',
})
export class ContactMeComponent {
  url = environment.apiUrl + '/contact';
  ct: Contact[] = [];
  form: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = fb.group({
      name: [''],
      email: [''],
      subject: [''],
      msg: [''],
      phone: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const val = this.form.value;
      this.http.post(this.url, val).subscribe({
        next: (res) => {
          console.log('Message sent!', res);
          this.form.reset(); // Optionally reset the form after success
        },
        error: (err) => {
          console.error('Submission failed', err);
        },
      });
    } else {
      console.warn('Form is invalid');
    }
  }
}
