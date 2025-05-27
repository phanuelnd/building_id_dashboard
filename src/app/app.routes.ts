import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent) 
  },
  { 
    path: 'buildings', 
    loadComponent: () => import('./pages/buildings/buildings.component').then(m => m.BuildingsComponent) 
  },
  { path: 'register', component: DashboardComponent }, // Placeholder
  { path: 'inspections', component: DashboardComponent }, // Placeholder
  { path: 'reports', component: DashboardComponent }, // Placeholder
  { path: 'settings', component: DashboardComponent }, // Placeholder
  { path: '**', redirectTo: '/dashboard' }
];

// Import for placeholders
import { DashboardComponent } from './pages/dashboard/dashboard.component';
