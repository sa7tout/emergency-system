import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { HospitalService } from '../hospital.service';
import { HospitalResponse } from '../models/hospital.model';
import { AddEditHospitalDialog } from '../dialogs/add-edit-hospital.dialog';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressBarModule,
    MatDialogModule,
    MatIconModule
  ],
  template: `
    <div class="container mx-auto p-6">
      <div class="relative w-full mb-6">
        <h1 class="text-2xl font-bold">Hospital Management</h1>
        <div class="absolute top-0 right-0">
          <button mat-raised-button color="primary" (click)="addHospital()">
            <mat-icon>add</mat-icon>
            Add Hospital
          </button>
        </div>
      </div>

      <div class="flex flex-nowrap justify-between gap-4 mb-6">
        <mat-card class="stat-card">
          <mat-card-content class="stat-card-content">
            <div class="flex items-center gap-3">
              <mat-icon class="text-gray-600">local_hospital</mat-icon>
              <div>
                <div class="text-sm text-gray-600">Total Hospitals</div>
                <div class="text-2xl font-bold">{{hospitals.length}}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content class="stat-card-content">
            <div class="flex items-center gap-3">
              <mat-icon class="text-green-600">bed</mat-icon>
              <div>
                <div class="text-sm text-gray-600">Available Beds</div>
                <div class="text-2xl font-bold text-green-600">{{getTotalAvailableBeds()}}</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>

        <mat-card class="stat-card">
          <mat-card-content class="stat-card-content">
            <div class="flex items-center gap-3">
              <mat-icon class="text-amber-600">trending_up</mat-icon>
              <div>
                <div class="text-sm text-gray-600">Average Occupancy</div>
                <div class="text-2xl font-bold text-amber-600">{{getAverageOccupancy()}}%</div>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card>
        <mat-card-content>
          <table mat-table [dataSource]="hospitals" class="w-full">
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef>Name</th>
              <td mat-cell *matCellDef="let hospital">{{hospital.name}}</td>
            </ng-container>

            <ng-container matColumnDef="capacity">
              <th mat-header-cell *matHeaderCellDef>Capacity</th>
              <td mat-cell *matCellDef="let hospital">
                <div class="capacity-info">
                  <mat-progress-bar
                    [value]="getOccupancyPercentage(hospital)"
                    [color]="getCapacityColor(hospital)">
                  </mat-progress-bar>
                  <span class="text-sm">{{hospital.availableBeds}}/{{hospital.totalBeds}} beds</span>
                </div>
              </td>
            </ng-container>

            <ng-container matColumnDef="emergencyLoad">
              <th mat-header-cell *matHeaderCellDef>Emergency Load</th>
              <td mat-cell *matCellDef="let hospital">
                {{hospital.currentEmergencyLoad}}/{{hospital.emergencyCapacity}}
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef>Status</th>
              <td mat-cell *matCellDef="let hospital">
                <span [ngClass]="getStatusClass(hospital)">
                  {{hospital.isActive ? 'Active' : 'Inactive'}}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef>Actions</th>
              <td mat-cell *matCellDef="let hospital">
                <button mat-icon-button color="primary" (click)="editHospital(hospital)" matTooltip="Edit">
                  <mat-icon>edit</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .stat-card {
      flex: 1;
      min-width: 200px;
      max-width: 300px;
    }

    .capacity-info {
      width: 200px;
    }

    .active {
      color: #4caf50;
      font-weight: 500;
    }

    .inactive {
      color: #f44336;
      font-weight: 500;
    }
    .flex.flex-nowrap {
        display: flex;
        flex-wrap: nowrap; /* Prevent wrapping */
        overflow-x: auto; /* Enable horizontal scrolling if necessary */
        gap: 16px; /* Maintain spacing between cards */
      }

      .stat-card {
        flex: 0 0 auto; /* Prevent cards from shrinking or growing unevenly */
        min-width: 250px; /* Ensure a consistent minimum size */
        max-width: 300px; /* Optional: Set a consistent maximum size */
      }

      .stat-card-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
  `]
})
export class HospitalListComponent implements OnInit {
  hospitals: HospitalResponse[] = [];
  displayedColumns = ['name', 'capacity', 'emergencyLoad', 'status', 'actions'];

  constructor(
    private hospitalService: HospitalService,
    private dialog: MatDialog,
    private snackbar: SnackbarService
  ) {}

  ngOnInit() {
    this.loadHospitals();
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (response) => {
        console.log('API Response:', response);
        this.hospitals = Array.isArray(response) ? response : [];
      },
      error: (error) => {
        console.error('Error loading hospitals:', error);
        this.snackbar.showSnackbar('Failed to load hospitals', 'Close');
        this.hospitals = [];
      }
    });
  }


  getTotalAvailableBeds() {
    return this.hospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
  }

  getAverageOccupancy() {
    if (!this.hospitals.length) return 0;
    const total = this.hospitals.reduce((sum, hospital) =>
      sum + this.getOccupancyPercentage(hospital), 0);
    return Math.round(total / this.hospitals.length);
  }

  getOccupancyPercentage(hospital: HospitalResponse) {
    return ((hospital.totalBeds - hospital.availableBeds) / hospital.totalBeds) * 100;
  }

  getCapacityColor(hospital: HospitalResponse) {
    const occupancy = this.getOccupancyPercentage(hospital);
    return occupancy > 80 ? 'warn' : occupancy > 60 ? 'accent' : 'primary';
  }

  getStatusClass(hospital: HospitalResponse) {
    return hospital.isActive ? 'active' : 'inactive';
  }

  addHospital() {
    const dialogRef = this.dialog.open(AddEditHospitalDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadHospitals();
      }
    });
  }

  editHospital(hospital: HospitalResponse) {
    const dialogRef = this.dialog.open(AddEditHospitalDialog, {
      width: '600px',
      data: hospital
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadHospitals();
      }
    });
  }
}
