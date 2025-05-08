import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        console.log('Login response:', res);
        this.auth.storeToken(res.token);
        console.log('Token stored:', this.auth.getToken());
        this.router.navigate(['/services-crud']);
      },
      error: (err) => {
        console.error('Login failed', err);
        alert('Login failed');
      },
    });
  }
}
