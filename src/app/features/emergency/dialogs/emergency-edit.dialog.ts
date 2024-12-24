import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

import { EmergencyService } from '../emergency.service';
import { AmbulanceService } from '../../ambulance/ambulance.service';
import { HospitalService } from '../../hospital/hospital.service';

import { EmergencyResponse, EmergencyStatus, UpdateEmergencyRequest } from '../models/emergency.model';
import { AmbulanceResponse } from '../../ambulance/models/ambulance.model';
import { HospitalResponse } from '../../hospital/models/hospital.model';

import { SnackbarService } from 'src/app/shared/services/snackbar.service';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Component({
  selector: 'app-emergency-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>Edit Emergency</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <div class="row" style="display: flex; gap: 16px;">
          <mat-form-field style="flex: 1;">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option *ngFor="let status of statusOptions" [value]="status">
                {{status}}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field style="flex: 1;">
            <mat-label>Patient Name</mat-label>
            <input matInput formControlName="patientName">
          </mat-form-field>
        </div>

        <div class="row" style="display: flex; gap: 16px;">
          <mat-form-field style="flex: 1;">
            <mat-label>Contact Number</mat-label>
            <input matInput formControlName="contactNumber">
          </mat-form-field>

          <mat-form-field style="flex: 1;">
            <mat-label>Pickup Latitude</mat-label>
            <input matInput type="number" formControlName="pickupLatitude">
          </mat-form-field>
        </div>

        <div class="row" style="display: flex; gap: 16px;">
          <mat-form-field style="flex: 1;">
            <mat-label>Pickup Longitude</mat-label>
            <input matInput type="number" formControlName="pickupLongitude">
          </mat-form-field>

          <mat-form-field style="flex: 1;">
            <mat-label>Assigned Ambulance</mat-label>
            <mat-select formControlName="assignedAmbulanceId">
              <ng-container *ngIf="ambulances && ambulances.length > 0">
                <mat-option *ngFor="let ambulance of ambulances" [value]="ambulance.id">
                  {{ambulance.vehicleNumber}}
                </mat-option>
              </ng-container>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field>
          <mat-label>Assigned Hospital</mat-label>
          <mat-select formControlName="assignedHospitalId">
            <ng-container *ngIf="hospitals && hospitals.length > 0">
              <mat-option *ngFor="let hospital of hospitals" [value]="hospital.id">
                {{hospital.name}}
              </mat-option>
            </ng-container>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button [mat-dialog-close]="false">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid">Update</button>
      </mat-dialog-actions>
    </form>
  `
})
export class EmergencyEditDialog implements OnInit {
  form: FormGroup;
  statusOptions = Object.values(EmergencyStatus);
  ambulances: AmbulanceResponse[] = [];
  hospitals: HospitalResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EmergencyEditDialog>,
    private emergencyService: EmergencyService,
    private ambulanceService: AmbulanceService,
    private hospitalService: HospitalService,
    private snackbarService: SnackbarService,  // Inject SnackbarService
    @Inject(MAT_DIALOG_DATA) public data: EmergencyResponse
  ) {
    this.form = this.fb.group({
      status: [data.status, Validators.required],
      patientName: [data.patientName, [Validators.required, Validators.minLength(2)]],
      contactNumber: [data.contactNumber, [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
      pickupLatitude: [data.pickupLatitude, [Validators.required, Validators.min(-90), Validators.max(90)]],
      pickupLongitude: [data.pickupLongitude, [Validators.required, Validators.min(-180), Validators.max(180)]],
      assignedAmbulanceId: [data.assignedAmbulanceId],
      assignedHospitalId: [data.assignedHospitalId]
    });
  }

  ngOnInit() {
    this.loadAmbulances();
    this.loadHospitals();
  }

  loadAmbulances() {
    this.ambulanceService.getAllAmbulances().subscribe({
      next: (response: any) => {
        // Extract and filter ambulances
        this.ambulances = Array.isArray(response)
          ? response.filter((ambulance: AmbulanceResponse) =>
              ambulance.status === 'AVAILABLE' && ambulance.active
            )
          : ((response?.data || []).filter((ambulance: AmbulanceResponse) =>
              ambulance.status === 'AVAILABLE' && ambulance.active
            ));

        // Show a message if no available ambulances
        if (this.ambulances.length === 0) {
          this.snackbarService.showSnackbar('No available ambulances', 'Close');
        }

      },
      error: (error: any) => {
        // Default error message
        let errorMessage = 'Failed to load ambulances';

        // Customize for common error scenarios
        if (error.status === 404) {
          errorMessage = 'Ambulance data not found';
        } else if (error.status === 500) {
          errorMessage = 'Server error while loading ambulances';
        }

        // Show error and reset ambulances
        this.snackbarService.showSnackbar(errorMessage, 'Close');
        this.ambulances = [];

        // Log for debugging
        console.error('Ambulance loading error:', error);
      }
    });
  }


  loadHospitals() {
    this.hospitalService.getHospitals().subscribe({
      next: (response: any) => {
        // Ensure we always have an array
        this.hospitals = Array.isArray(response)
          ? response
          : (response?.data || []);

        // Show a message if no hospitals found
        if (this.hospitals.length === 0) {
          this.snackbarService.showSnackbar('No hospitals available', 'Close');
        }
      },
      error: (error: any) => {
        // Default error message
        let errorMessage = 'Failed to load hospitals';

        // Customize for common error scenarios
        if (error.status === 404) {
          errorMessage = 'Hospital data not found';
        } else if (error.status === 500) {
          errorMessage = 'Server error while loading hospitals';
        }

        // Show error and reset hospitals
        this.snackbarService.showSnackbar(errorMessage, 'Close');
        this.hospitals = [];

        // Log for debugging
        console.error('Hospital loading error:', error);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const updateRequest: UpdateEmergencyRequest = this.form.value;
      this.emergencyService.updateEmergency(this.data.id, updateRequest)
        .subscribe({
          next: (updatedEmergency: EmergencyResponse) => {
            this.snackbarService.showSnackbar('Emergency updated successfully', 'Close');
            this.dialogRef.close(updatedEmergency);
          },
          error: (error: Error) => {
            this.snackbarService.showSnackbar('Failed to update emergency', 'Close');
            console.error('Error updating emergency', error);
          }
        });
    }
  }
}
