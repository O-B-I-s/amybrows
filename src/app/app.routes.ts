import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'node:path';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';
import { DescriptionsCrudComponent } from './components/descriptions-crud/descriptions-crud.component';
import { GalleryCrudComponent } from './components/gallery-crud/gallery-crud.component';
import { ServicesCrudComponent } from './components/services-crud/services-crud.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from '../../guard/auth.guard';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ContactMeComponent } from './components/contact-me/contact-me.component';

export const routes: Routes = [
  { path: 'appointment', component: BookAppointmentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'galleries', component: GalleryComponent },
  { path: 'contact', component: ContactMeComponent },
  {
    path: 'descriptions',
    component: DescriptionsCrudComponent,
    canActivate: [authGuard],
  },
  {
    path: 'services-crud',
    component: ServicesCrudComponent,
    canActivate: [authGuard],
  },
  {
    path: 'gallery',
    component: GalleryCrudComponent,
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
