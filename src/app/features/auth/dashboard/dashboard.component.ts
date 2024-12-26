import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule
  ],
  template: `
    <div class="dashboard-container">
      <mat-toolbar class="toolbar">
        <button mat-icon-button (click)="sidenav.toggle()">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="brand">
          <mat-icon>emergency</mat-icon>
          Emergency Response System
        </span>
        <span class="spacer"></span>

        <button mat-icon-button [matMenuTriggerFor]="menu" class="notification-btn">
          <mat-icon matBadge="3" matBadgeColor="warn">notifications</mat-icon>
        </button>
        <mat-menu #menu="matMenu">
          <button mat-menu-item>
            <mat-icon color="warn">warning</mat-icon>
            <span>New Emergency Alert</span>
          </button>
          <button mat-menu-item>
            <mat-icon color="primary">local_hospital</mat-icon>
            <span>Ambulance Status Update</span>
          </button>
          <button mat-menu-item>
            <mat-icon>notification_important</mat-icon>
            <span>System Maintenance</span>
          </button>
        </mat-menu>

        <button mat-button (click)="logout()" class="logout-btn">
          <mat-icon>exit_to_app</mat-icon>
          Logout
        </button>
      </mat-toolbar>

      <mat-sidenav-container class="sidenav-container">
        <mat-sidenav #sidenav mode="side" opened class="sidenav">
          <div class="user-info">
            <mat-icon class="admin-icon">admin_panel_settings</mat-icon>
            <div class="user-details">
              <h3>Admin Dashboard</h3>
              <p class="user-role">System Administrator</p>
            </div>
          </div>

          <mat-nav-list>
            <a mat-list-item routerLink="/admin" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <mat-icon class="nav-icon">dashboard</mat-icon>
              <span>Overview</span>
            </a>
            <a mat-list-item routerLink="/admin/emergencies" routerLinkActive="active">
              <mat-icon class="nav-icon" color="warn">warning</mat-icon>
              <span>Emergencies</span>
            </a>
            <a mat-list-item routerLink="/admin/ambulances" routerLinkActive="active">
              <mat-icon class="nav-icon">local_hospital</mat-icon>
              <span>Ambulances</span>
            </a>
            <a mat-list-item routerLink="/admin/hospitals" routerLinkActive="active">
              <mat-icon class="nav-icon">business</mat-icon>
              <span>Hospitals</span>
            </a>
            <a mat-list-item routerLink="/admin/reports" routerLinkActive="active">
              <mat-icon class="nav-icon">assessment</mat-icon>
              <span>Reports</span>
            </a>
            <a mat-list-item routerLink="/admin/settings" routerLinkActive="active">
              <mat-icon class="nav-icon">settings</mat-icon>
              <span>Settings</span>
            </a>
          </mat-nav-list>

          <div class="system-status">
            <div class="status-indicator">
              <span class="status-dot"></span>
              System Online
            </div>
            <span class="status-time">Last updated: 5m ago</span>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="content">
          <router-outlet></router-outlet>
        </mat-sidenav-content>
      </mat-sidenav-container>
    </div>
  `,
  styles: [`
    .dashboard-container {
      height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .toolbar {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #dc3545;
      color: white;
      height: 64px;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1.2rem;
      font-weight: 500;
      margin-left: 8px;
    }

    .spacer {
      flex: 1 1 auto;
    }

    .notification-btn {
      margin-right: 8px;
    }

    .logout-btn {
      margin-left: 8px;
      margin-right: 16px;
    }

    .sidenav-container {
      flex: 1;
      background-color: #f8f9fa;
    }

    .sidenav {
      width: 280px;
      background-color: #ffffff;
      border-right: 1px solid #e0e0e0;
      box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
    }

    .user-info {
      padding: 24px 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      background: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
    }

    .admin-icon {
      font-size: 40px;
      width: 40px;
      height: 40px;
      color: #dc3545;
    }

    .user-details h3 {
      margin: 0;
      font-size: 1.1rem;
      color: #333333;
    }

    .user-role {
      margin: 4px 0 0;
      font-size: 0.9rem;
      color: #666666;
    }

    mat-nav-list {
      padding-top: 8px;
    }

    mat-nav-list a {
      color: #333333 !important;
      height: 48px !important;
      margin: 4px 8px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }

    mat-nav-list a:hover {
      background-color: #f5f5f5;
    }

    .nav-icon {
      margin-right: 12px;
      color: #666666;
    }

    .active {
      background-color: rgba(220, 53, 69, 0.1) !important;
      border-left: 4px solid #dc3545;
    }

    .active .mat-icon {
      color: #dc3545;
    }

    .active span {
      color: #dc3545;
      font-weight: 500;
    }

    .content {
      padding: 24px;
      background-color: #ffffff;
      min-height: calc(100vh - 64px);
    }

    .system-status {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 16px;
      background-color: #f8f9fa;
      border-top: 1px solid #e0e0e0;
    }

    .status-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #28a745;
      font-size: 0.9rem;
    }

    .status-dot {
      width: 8px;
      height: 8px;
      background-color: #28a745;
      border-radius: 50%;
    }

    .status-time {
      display: block;
      font-size: 0.8rem;
      color: #666666;
      margin-top: 4px;
    }

    ::ng-deep .mat-badge-content {
      background-color: #dc3545 !important;
    }
  `]
})
export class DashboardComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ){
    this.themeService.isDarkTheme$.subscribe(isDark => {
        document.body.classList.toggle('dark-theme', isDark);
      });
    }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
