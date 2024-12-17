import { Route } from '@angular/router';

export const HOSPITAL_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./hospital-list/hospital-list.component').then(m => m.HospitalListComponent)
  }
];
