import { Route } from '@angular/router';

export const AMBULANCE_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./ambulance-list/ambulance-list.component').then(m => m.AmbulanceListComponent)
  }
];
