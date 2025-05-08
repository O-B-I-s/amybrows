import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterModule],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css',
})
export class NavBarComponent {
  mobileOpen = false;
  constructor(public auth: AuthService, private router: Router) {}

  toggleMenu() {
    this.mobileOpen = !this.mobileOpen;
  }
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
