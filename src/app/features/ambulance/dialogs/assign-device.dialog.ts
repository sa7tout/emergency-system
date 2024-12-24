import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceResponse, Employee } from '../models/ambulance.model';
import { AmbulanceService } from '../ambulance.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-assign-device-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Assign Device to Driver</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field>
          <mat-label>Select Device</mat-label>
          <mat-select formControlName="deviceId" required>
            <mat-option *ngFor="let device of devices" [value]="device.id">
              {{ device.deviceId }} ({{ device.status }})
            </mat-option>
          </mat-select>
          <mat-hint *ngIf="devices.length === 0" class="text-warn">
            No available devices found
          </mat-hint>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Select Driver</mat-label>
          <mat-select formControlName="employeeId" required>
            <mat-option *ngFor="let driver of drivers" [value]="driver.id">
              {{ driver.fullName }} ({{ driver.employeeId }}) - {{ driver.status }}
            </mat-option>
          </mat-select>
          <mat-hint *ngIf="drivers.length === 0" class="text-warn">
            No available drivers found
          </mat-hint>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
      <button mat-raised-button color="primary"
              (click)="onSubmit()"
              [disabled]="form.invalid || drivers.length === 0 || devices.length === 0">
        Assign Device
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    .text-warn {
      color: #f44336;
    }
  `]
})
export class AssignDeviceDialog implements OnInit {
  form: FormGroup;
  drivers: Employee[] = [];
  devices: DeviceResponse[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssignDeviceDialog>,
    private ambulanceService: AmbulanceService,
    private snackBar: MatSnackBar
  ) {
    this.form = this.fb.group({
      deviceId: ['', Validators.required],
      employeeId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadDrivers();
    this.loadDevices();
  }

  private loadDrivers() {
    this.ambulanceService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        this.drivers = drivers.filter(d => d.status === 'ACTIVE' && d.role === 'DRIVER');
        if (this.drivers.length === 0) {
          this.snackBar.open('No available drivers found', 'Close', {
            duration: 5000,
            panelClass: ['warn-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error loading drivers:', error);
        this.snackBar.open('Error loading drivers', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  private loadDevices() {
    this.ambulanceService.getAllDevices().subscribe({
      next: (response) => {
        this.devices = response.data;
        if (this.devices.length === 0) {
          this.snackBar.open('No available devices found', 'Close', {
            duration: 5000,
            panelClass: ['warn-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.snackBar.open('Error loading devices', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
