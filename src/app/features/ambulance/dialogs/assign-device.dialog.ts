// assign-device-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceResponse, Employee } from '../models/ambulance.model';
import { AmbulanceService } from '../ambulance.service';

@Component({
  selector: 'app-assign-device-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Assign Device to Driver</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="mat-typography p-4">
        <div class="row mb-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Device ID</mat-label>
            <input matInput [value]="data.deviceId" readonly>
          </mat-form-field>
        </div>

        <div class="row">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>Select Driver</mat-label>
            <mat-select formControlName="employeeId" required>
              <mat-option *ngFor="let driver of drivers" [value]="driver.id">
                {{driver.fullName}} ({{driver.employeeId}}) - {{driver.status}}
              </mat-option>
            </mat-select>
            <mat-hint>Only active drivers are shown</mat-hint>
            <mat-error *ngIf="form.get('employeeId')?.hasError('required')">
              Driver selection is required
            </mat-error>
          </mat-form-field>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="false">Cancel</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || isLoading">
          <mat-icon>link</mat-icon>
          Assign Device
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .row { margin-bottom: 16px; }
    mat-form-field { width: 100%; }
  `]
})
export class AssignDeviceDialog implements OnInit {
  form: FormGroup;
  drivers: Employee[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AssignDeviceDialog>,
    private ambulanceService: AmbulanceService,
    @Inject(MAT_DIALOG_DATA) public data: DeviceResponse
  ) {
    this.form = this.fb.group({
      employeeId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDrivers();
  }

  private loadDrivers() {
    this.ambulanceService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        this.drivers = drivers.filter(d => d.status === 'ACTIVE' && d.role === 'DRIVER');
      },
      error: (error) => console.error('Error loading drivers:', error)
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close({
        deviceId: this.data.id,
        employeeId: this.form.value.employeeId
      });
    }
  }
}
