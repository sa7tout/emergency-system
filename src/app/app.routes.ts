import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/auth/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'emergencies',
        loadChildren: () => import('./features/emergency/emergency.routes').then(m => m.EMERGENCY_ROUTES)
      },
      {
        path: 'ambulances',
        loadChildren: () => import('./features/ambulance/ambulance.routes').then(m => m.AMBULANCE_ROUTES)
      },
      {
        path: 'hospitals',
        loadChildren: () => import('./features/hospital/hospital.routes').then(m => m.HOSPITAL_ROUTES)
      },
      { path: '', redirectTo: 'emergencies', pathMatch: 'full' }
    ]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
