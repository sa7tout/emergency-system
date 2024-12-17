import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HospitalService, HospitalResponse } from '../hospital.service';

@Component({
  selector: 'app-hospital-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="hospital-container">
      <div class="header">
        <h2>Hospitals</h2>
        <div class="capacity-overview">
          <div class="overview-card">
            <span class="label">Total Hospitals</span>
            <span class="value">{{hospitals.length}}</span>
          </div>
          <div class="overview-card">
            <span class="label">Total Available Beds</span>
            <span class="value">{{getTotalAvailableBeds()}}</span>
          </div>
          <div class="overview-card">
            <span class="label">Average Occupancy</span>
            <span class="value">{{getAverageOccupancy()}}%</span>
          </div>
        </div>
      </div>

      <mat-table [dataSource]="hospitals" class="mat-elevation-z8">
        <ng-container matColumnDef="name">
          <mat-header-cell *matHeaderCellDef>Name</mat-header-cell>
          <mat-cell *matCellDef="let element">{{element.name}}</mat-cell>
        </ng-container>

        <ng-container matColumnDef="capacity">
          <mat-header-cell *matHeaderCellDef>Capacity</mat-header-cell>
          <mat-cell *matCellDef="let element">
            <div class="capacity-info">
              <mat-progress-bar
                [value]="getOccupancyPercentage(element)"
                [color]="getCapacityColor(element)">
              </mat-progress-bar>
              <span>{{element.availableBeds}}/{{element.totalBeds}} beds</span>
            </div>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="emergencyLoad">
          <mat-header-cell *matHeaderCellDef>Emergency Load</mat-header-cell>
          <mat-cell *matCellDef="let element">
            {{element.currentEmergencyLoad}}/{{element.emergencyCapacity}}
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="status">
          <mat-header-cell *matHeaderCellDef>Status</mat-header-cell>
          <mat-cell *matCellDef="let element">
            <span [class]="getStatusClass(element)">
              {{element.isActive ? 'Active' : 'Inactive'}}
            </span>
          </mat-cell>
        </ng-container>

        <ng-container matColumnDef="actions">
          <mat-header-cell *matHeaderCellDef>Actions</mat-header-cell>
          <mat-cell *matCellDef="let element">
            <button mat-button color="primary" (click)="updateCapacity(element)">Update</button>
            <button mat-button color="accent" (click)="viewDetails(element)">Details</button>
          </mat-cell>
        </ng-container>

        <mat-header-row *matHeaderRowDef="displayedColumns"></mat-header-row>
        <mat-row *matRowDef="let row; columns: displayedColumns;"></mat-row>
      </mat-table>
    </div>
  `,
  styles: [`
    .hospital-container {
      padding: 20px;
    }
    .header {
      margin-bottom: 20px;
    }
    .capacity-overview {
      display: flex;
      gap: 20px;
      margin-top: 20px;
    }
    .overview-card {
      background: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      flex: 1;
    }
    .capacity-info {
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 200px;
    }
    .active {
      color: #4caf50;
    }
    .inactive {
      color: #f44336;
    }
    mat-table {
      width: 100%;
    }
  `]
})
export class HospitalListComponent implements OnInit {
  hospitals: HospitalResponse[] = [];
  displayedColumns = ['name', 'capacity', 'emergencyLoad', 'status', 'actions'];

  constructor(private hospitalService: HospitalService) {}

  ngOnInit() {
    this.loadHospitals();
  }

  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (data) => this.hospitals = data,
      error: (error) => console.error('Error loading hospitals:', error)
    });
  }

  getTotalAvailableBeds() {
    return this.hospitals.reduce((sum, hospital) => sum + hospital.availableBeds, 0);
  }

  getAverageOccupancy() {
    const total = this.hospitals.reduce((sum, hospital) => {
      return sum + this.getOccupancyPercentage(hospital);
    }, 0);
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

  updateCapacity(hospital: HospitalResponse) {
    // Implement update capacity dialog
  }

  viewDetails(hospital: HospitalResponse) {
    // Implement view details
  }
}
