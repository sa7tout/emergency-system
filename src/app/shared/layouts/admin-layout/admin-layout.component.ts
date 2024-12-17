import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    MatListModule
  ],
  template: `
    <div class="min-h-screen bg-gray-100">
      <mat-toolbar color="primary" class="bg-red-600">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="ml-2">Emergency Response System</span>
      </mat-toolbar>

      <mat-sidenav-container class="h-[calc(100vh-64px)]">
        <mat-sidenav #sidenav mode="side" opened class="w-64 p-4">
          <mat-nav-list>
            <a mat-list-item routerLink="dashboard" routerLinkActive="bg-red-100">
              <mat-icon matListItemIcon>dashboard</mat-icon>
              <span>Dashboard</span>
            </a>
            <a mat-list-item routerLink="emergencies" routerLinkActive="bg-red-100">
              <mat-icon matListItemIcon>warning</mat-icon>
              <span>Emergencies</span>
            </a>
            <a mat-list-item routerLink="ambulances" routerLinkActive="bg-red-100">
              <mat-icon matListItemIcon>local_hospital</mat-icon>
              <span>Ambulances</span>
            </a>
            <a mat-list-item routerLink="hospitals" routerLinkActive="bg-red-100">
              <mat-icon matListItemIcon>business</mat-icon>
              <span>Hospitals</span>
            </a>
          </mat-nav-list>
        </mat-sidenav>

        <mat-sidenav-content class="p-6">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `
})
export class AdminLayoutComponent {
  constructor(private router: Router) {}
}
