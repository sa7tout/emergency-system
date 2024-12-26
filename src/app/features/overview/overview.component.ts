import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { EmergencyService } from '../emergency/emergency.service';
import { AmbulanceService } from '../ambulance/ambulance.service';
import { AuthService } from '../../core/services/auth.service';
import { EmergencyResponse, EmergencyStatus } from '../emergency/models/emergency.model';
import { Employee } from '../ambulance/models/ambulance.model';
import { AddEmployeeDialogComponent } from './add-employee-dialog.component';

interface DisplayEmergency extends EmergencyResponse {
  location: string;
  type: string;
}

interface DisplayDriver extends Employee {
  name: string;
  status: string;
  assignedVehicle: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatDialogModule
  ],
  template: `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Emergencies Card -->
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar color="warn">warning</mat-icon>
          <mat-card-title>Pending Emergencies</mat-card-title>
          <mat-card-subtitle>Recent emergency calls</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <table mat-table [dataSource]="pendingEmergencies" class="w-full">
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let emergency">
                <mat-icon [color]="getStatusColor(emergency.status)">
                  {{getStatusIcon(emergency.status)}}
                </mat-icon>
              </td>
            </ng-container>

            <ng-container matColumnDef="patientName">
              <th mat-header-cell *matHeaderCellDef>Patient</th>
              <td mat-cell *matCellDef="let emergency">{{emergency.patientName}}</td>
            </ng-container>

            <ng-container matColumnDef="contact">
              <th mat-header-cell *matHeaderCellDef>Contact</th>
              <td mat-cell *matCellDef="let emergency">{{emergency.contactNumber}}</td>
            </ng-container>

            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef>Location</th>
              <td mat-cell *matCellDef="let emergency">{{emergency.location}}</td>
            </ng-container>

            <ng-container matColumnDef="ambulance">
              <th mat-header-cell *matHeaderCellDef>Unit ID</th>
              <td mat-cell *matCellDef="let emergency">AMB-{{emergency.assignedAmbulanceId?.toString().padStart(3, '0')}}</td>
            </ng-container>

            <ng-container matColumnDef="time">
              <th mat-header-cell *matHeaderCellDef>Time</th>
              <td mat-cell *matCellDef="let emergency">
                {{emergency.createdAt | date:'shortTime'}}
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="emergencyColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: emergencyColumns;"></tr>
          </table>
          <div *ngIf="pendingEmergencies.length === 0" class="p-4 text-center text-gray-500">
            No pending emergencies
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Drivers Card -->
      <mat-card>
        <mat-card-header>
          <mat-icon mat-card-avatar>drive_eta</mat-icon>
          <mat-card-title>Available Drivers</mat-card-title>
          <mat-card-subtitle>Active ambulance personnel</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <div class="mb-4">
            <button mat-raised-button color="primary" (click)="openAddEmployee()">
              <mat-icon>add</mat-icon>
              Register New Driver
            </button>
          </div>
          <table mat-table [dataSource]="availableDrivers" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let driver">{{driver.name}}</td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let driver">
                <span [class]="getDriverStatusClass(driver.status)">
                  {{driver.status}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="vehicle">
              <th mat-header-cell *matHeaderCellDef>Vehicle</th>
              <td mat-cell *matCellDef="let driver">{{driver.assignedVehicle}}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="driverColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: driverColumns;"></tr>
          </table>
          <div *ngIf="availableDrivers.length === 0" class="p-4 text-center text-gray-500">
            No available drivers
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      padding: 20px;
    }

    .mat-mdc-card {
      margin-bottom: 20px;
    }

    .mat-column-status {
      width: 80px;
    }

    .mat-column-time {
      width: 100px;
    }

    .status-available {
      @apply px-2 py-1 rounded-full bg-green-100 text-green-800 text-sm;
    }

    .status-busy {
      @apply px-2 py-1 rounded-full bg-red-100 text-red-800 text-sm;
    }

    .status-break {
      @apply px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm;
    }

    table {
      width: 100%;
    }

    .mat-mdc-row:hover {
      background-color: rgba(0, 0, 0, 0.04);
    }

    .mb-4 {
      margin-bottom: 1rem;
    }
  `]
})
export class OverviewComponent implements OnInit {
  pendingEmergencies: DisplayEmergency[] = [];
  availableDrivers: DisplayDriver[] = [];
  emergencyColumns = ['status', 'patientName', 'contact', 'location', 'ambulance', 'time'];
  driverColumns = ['name', 'status', 'vehicle'];

  constructor(
    private emergencyService: EmergencyService,
    private ambulanceService: AmbulanceService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadEmergencies();
    this.loadDrivers();
  }

  openAddEmployee() {
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent, {
      width: '500px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.authService.registerEmployee(result).subscribe({
          next: (response) => {
            console.log('Employee registered successfully:', response);
            this.loadDrivers(); // Refresh the list
          },
          error: (error) => {
            console.error('Failed to register employee:', error);
          }
        });
      }
    });
  }

  private loadEmergencies() {
    this.emergencyService.getEmergencies().subscribe({
      next: (emergencies) => {
        this.pendingEmergencies = emergencies
          .filter(e => e.status === 'PENDING' || e.status === 'IN_PROGRESS')
          .map(e => ({
            ...e,
            location: `${e.pickupLatitude.toFixed(4)}° N, ${e.pickupLongitude.toFixed(4)}° W`,
            type: this.getEmergencyType(e)
          }))
          .slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading emergencies:', error);
      }
    });
  }

  private loadDrivers() {
    this.ambulanceService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        this.availableDrivers = drivers.map(d => ({
          ...d,
          name: d.fullName,
          status: 'Available',
          assignedVehicle: `AMB-${d.id.toString().padStart(3, '0')}`
        })).slice(0, 5);
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
      }
    });
  }

  private getEmergencyType(emergency: EmergencyResponse): string {
    return 'Medical Emergency';
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'warn';
      case 'IN_PROGRESS': return 'accent';
      default: return 'primary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'PENDING': return 'error_outline';
      case 'IN_PROGRESS': return 'update';
      default: return 'check_circle';
    }
  }

  getDriverStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'available': return 'status-available';
      case 'busy': return 'status-busy';
      case 'break': return 'status-break';
      default: return '';
    }
  }
}
