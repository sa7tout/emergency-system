import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { HospitalService } from '../hospital.service';
import { HospitalResponse, HospitalRequest } from '../models/hospital.model';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-add-edit-hospital-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  template: `
    <h2 mat-dialog-title class="text-xl font-bold mb-4 px-6 pt-4">
      {{data ? 'Edit' : 'Add'}} Hospital
    </h2>

    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="p-6">

        <!-- Basic Info Section -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Basic Information</h3>
          <div style="display: flex; gap: 16px;">
            <mat-form-field appearance="outline" style="flex: 1; margin-right: 16px;">
              <mat-label>Hospital Name</mat-label>
              <input matInput formControlName="name" required>
            </mat-form-field>

            <mat-form-field appearance="outline" style="flex: 1;">
              <mat-label>Contact Number</mat-label>
              <input matInput formControlName="contactNumber" required>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full mt-6">
            <mat-label>Address</mat-label>
            <input matInput formControlName="address" required>
          </mat-form-field>
        </div>

        <!-- Location Section -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Location Details</h3>
          <div style="display: flex; gap: 16px;">
            <mat-form-field appearance="outline" style="flex: 1; margin-right: 16px;">
              <mat-label>Latitude</mat-label>
              <input matInput type="number" formControlName="latitude" required>
            </mat-form-field>

            <mat-form-field appearance="outline" style="flex: 1;">
              <mat-label>Longitude</mat-label>
              <input matInput type="number" formControlName="longitude" required>
            </mat-form-field>
          </div>
        </div>

        <!-- Capacity Section -->
        <div class="mb-8">
          <h3 class="text-lg font-medium mb-4">Capacity Information</h3>
          <div style="display: flex; gap: 16px;">
            <mat-form-field appearance="outline" style="flex: 1; margin-right: 16px;">
              <mat-label>Total Beds</mat-label>
              <input matInput type="number" formControlName="totalBeds" required>
            </mat-form-field>

            <mat-form-field appearance="outline" style="flex: 1;">
              <mat-label>Emergency Capacity</mat-label>
              <input matInput type="number" formControlName="emergencyCapacity" required>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="w-full mt-6">
            <mat-label>Specialties</mat-label>
            <textarea matInput formControlName="specialties" rows="3"
                      placeholder="Enter hospital specialties (e.g., Cardiology, Neurology)"></textarea>
          </mat-form-field>
        </div>

      </mat-dialog-content>

      <mat-dialog-actions align="end" class="px-6 py-4 bg-gray-50">
        <button mat-button mat-dialog-close type="button" class="mr-3">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!form.valid">
          {{data ? 'Update' : 'Create'}} Hospital
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class AddEditHospitalDialog {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditHospitalDialog>,
    private hospitalService: HospitalService,
    private snackbar: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: HospitalResponse
  ) {
    this.form = this.fb.group({
      name: [data?.name || '', Validators.required],
      address: [data?.address || '', Validators.required],
      latitude: [data?.latitude || '', [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [data?.longitude || '', [Validators.required, Validators.min(-180), Validators.max(180)]],
      totalBeds: [data?.totalBeds || '', [Validators.required, Validators.min(0)]],
      emergencyCapacity: [data?.emergencyCapacity || '', [Validators.required, Validators.min(0)]],
      specialties: [data?.specialties || ''],
      contactNumber: [data?.contactNumber || '', [Validators.required, Validators.pattern('^\\+?[1-9]\\d{1,14}$')]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const hospitalData: HospitalRequest = this.form.value;

      if (this.data) {
        this.hospitalService.updateHospital(this.data.id, hospitalData).subscribe({
          next: () => {
            this.snackbar.showSnackbar('Hospital updated successfully', 'Close');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackbar.showSnackbar(error.error?.message || 'Error updating hospital', 'Close');
          }
        });
      } else {
        this.hospitalService.createHospital(hospitalData).subscribe({
          next: () => {
            this.snackbar.showSnackbar('Hospital created successfully', 'Close');
            this.dialogRef.close(true);
          },
          error: (error) => {
            this.snackbar.showSnackbar(error.error?.message || 'Error creating hospital', 'Close');
          }
        });
      }
    }
  }
}
