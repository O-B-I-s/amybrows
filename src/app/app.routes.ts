import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'node:path';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { HomeComponent } from './components/home/home.component';
import { ServicesComponent } from './components/services/services.component';

export const routes: Routes = [
  { path: 'appointment', component: BookAppointmentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'services', component: ServicesComponent },
];
