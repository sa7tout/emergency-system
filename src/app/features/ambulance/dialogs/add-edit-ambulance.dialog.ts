import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AmbulanceResponse, AmbulanceStatus, DeviceResponse } from '../models/ambulance.model';
import { AmbulanceService } from '../ambulance.service';
import { MatSnackBar } from '@angular/material/snack-bar';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}


@Component({
  selector: 'app-add-edit-ambulance-dialog',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  styles: [`
    .row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
    }

    .form-field {
      flex: 1;
      margin-right: 16px;
    }

    .form-field:last-child {
      margin-right: 0;
    }

    .year-field {
      flex: none;
      width: 120px;
      height: 40px;
    }

    .device-id-field {
      flex: none;
      width: 250px;
    }

    .equipment-field {
      flex: 2;
    }

    .no-devices-hint {
      color: #f44336;
      font-size: 12px;
      margin-top: 4px;
    }
  `],
  template: `
    <h2 mat-dialog-title>{{data ? 'Edit' : 'Add'}} Ambulance</h2>
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <mat-dialog-content class="mat-typography">
        <div class="p-4">
          <!-- Row 1 -->
          <div class="row">
            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Vehicle Number</mat-label>
              <input matInput formControlName="vehicleNumber" placeholder="e.g., AMB-001">
              <mat-error *ngIf="form.get('vehicleNumber')?.hasError('required')">
                Vehicle number is required
              </mat-error>
              <mat-error *ngIf="form.get('vehicleNumber')?.hasError('pattern')">
                Use format: AMB-XXX (letters, numbers, and hyphens only)
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field">
              <mat-label>Model</mat-label>
              <input matInput formControlName="model" placeholder="e.g., Toyota HiAce">
              <mat-error *ngIf="form.get('model')?.hasError('required')">
                Model is required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Row 2 -->
          <div class="row">
            <mat-form-field appearance="outline" class="form-field year-field">
              <mat-label>Year</mat-label>
              <input matInput type="number" formControlName="year" placeholder="e.g., 2023">
              <mat-error *ngIf="form.get('year')?.hasError('required')">
                Year is required
              </mat-error>
              <mat-error *ngIf="form.get('year')?.hasError('min')">
                Invalid year
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field equipment-field">
              <mat-label>Equipment Details</mat-label>
              <textarea matInput formControlName="equipmentDetails" rows="3"
                placeholder="List the equipment available in the ambulance"></textarea>
              <mat-error *ngIf="form.get('equipmentDetails')?.hasError('required')">
                Equipment details are required
              </mat-error>
            </mat-form-field>
          </div>

          <!-- Row 3 -->
          <div class="row">
            <mat-form-field appearance="outline" class="form-field device-id-field">
              <mat-label>Device</mat-label>
              <mat-select formControlName="deviceId">
                <mat-option *ngFor="let device of deviceOptions" [value]="device.deviceId">
                  {{device.deviceId}} ({{device.ambulanceUnit || 'Unassigned'}})
                </mat-option>
              </mat-select>
              <mat-error *ngIf="form.get('deviceId')?.hasError('required')">
                Device is required
              </mat-error>
              <mat-hint *ngIf="deviceOptions.length === 0">
                No available devices. Please register a device first.
              </mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="form-field" *ngIf="data">
              <mat-label>Status</mat-label>
              <mat-select formControlName="status">
                <mat-option *ngFor="let status of statusOptions" [value]="status">
                  {{status}}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end" class="p-4">
        <button mat-button mat-dialog-close type="button">Cancel</button>
        <button
          mat-raised-button
          color="primary"
          type="submit"
          [disabled]="form.invalid || deviceOptions.length === 0">
          {{data ? 'Update' : 'Add'}}
        </button>
      </mat-dialog-actions>
    </form>
  `
})
export class AddEditAmbulanceDialog implements OnInit {
  form: FormGroup;
  statusOptions = Object.values(AmbulanceStatus);
  deviceOptions: DeviceResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddEditAmbulanceDialog>,
    private ambulanceService: AmbulanceService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: AmbulanceResponse | null
  ) {
    this.form = this.fb.group({
      vehicleNumber: [
        data?.vehicleNumber || '',
        [
          Validators.required,
          Validators.pattern('^[A-Z0-9-]{3,50}$')
        ]
      ],
      model: [
        data?.model || '',
        Validators.required
      ],
      year: [
        data?.year || new Date().getFullYear(),
        [
          Validators.required,
          Validators.min(1900)
        ]
      ],
      equipmentDetails: [
        data?.equipmentDetails || '',
        Validators.required
      ],
      deviceId: [
        data?.deviceId || '',
        Validators.required
      ],
      status: [
        data?.status || AmbulanceStatus.AVAILABLE
      ]
    });

    if (!data) {
      this.form.removeControl('status');
    }
  }

  ngOnInit() {
    this.loadDeviceOptions();
  }

  loadDeviceOptions() {
    this.ambulanceService.getAllDevices().subscribe({
      next: (response: ApiResponse<DeviceResponse[]>) => {
        const devices: DeviceResponse[] = response.data || [];
        //this.deviceOptions = devices.filter((d: DeviceResponse) => d.status === 'ACTIVE' && !d.ambulanceUnit);
        this.deviceOptions = devices.filter((d: DeviceResponse) => d.status === 'ASSIGNED');


        if (this.deviceOptions.length === 0) {
          this.snackBar.open('No available devices found. Register a device first.', 'Close', {
            duration: 5000,
            panelClass: ['warn-snackbar']
          });
        }
      },
      error: (error) => {
        console.error('Error loading devices:', error);
        this.snackBar.open('Error loading devices. Please try again.', 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }



  onSubmit() {
      if (this.form.valid) {
        if (this.deviceOptions.length === 0) {
          this.snackBar.open('Cannot create ambulance without an available device.', 'Close', {
            duration: 5000,
            panelClass: ['warn-snackbar']
          });
          return;
        }

        this.ambulanceService.registerAmbulance(this.form.value).subscribe({
          next: (response) => {
            this.dialogRef.close(response);
          },
          error: (error) => {
            const errorMessage = error.error?.message || 'Failed to register ambulance';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      } else {
        this.snackBar.open('Please fill all required fields correctly.', 'Close', {
          duration: 3000,
          panelClass: ['warn-snackbar']
        });
}
}
}
