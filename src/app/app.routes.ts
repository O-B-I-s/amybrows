import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'node:path';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';
import { DescriptionsCrudComponent } from './components/descriptions-crud/descriptions-crud.component';
import { GalleryCrudComponent } from './components/gallery-crud/gallery-crud.component';
import { ServicesCrudComponent } from './components/services-crud/services-crud.component';

export const routes: Routes = [
  { path: 'appointment', component: BookAppointmentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'descriptions', component: DescriptionsCrudComponent },
  { path: 'services-crud', component: ServicesCrudComponent },
  { path: 'gallery', component: GalleryCrudComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
