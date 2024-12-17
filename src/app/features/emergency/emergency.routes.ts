import { Route } from '@angular/router';

export const EMERGENCY_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./emergency-list/emergency-list.component').then(m => m.EmergencyListComponent)
  }
];
