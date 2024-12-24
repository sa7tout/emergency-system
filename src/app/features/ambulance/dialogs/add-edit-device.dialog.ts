import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@shared/material.module';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceResponse, AmbulanceResponse } from '../models/ambulance.model';
import { AmbulanceService } from '../ambulance.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
 selector: 'app-add-edit-device-dialog',
 standalone: true,
 imports: [CommonModule, MaterialModule, ReactiveFormsModule],
 providers: [SnackbarService],
 styles: [`
   :host {
     display: block;
     min-width: 400px;
     max-width: 600px;
   }

   .row {
     display: flex;
     gap: 16px;
     margin-bottom: 16px;
   }

   .form-field {
     flex: 1;
   }

   mat-dialog-content {
     min-height: 150px;
   }

   .status-field {
     width: 200px;
   }
 `],
 template: `
   <h2 mat-dialog-title>{{data ? 'Edit Device' : 'Register New Device'}}</h2>

   <form [formGroup]="form" (ngSubmit)="onSubmit()">
     <mat-dialog-content class="mat-typography">
       <div class="p-4">
         <div class="row">
           <mat-form-field appearance="outline" class="form-field">
             <mat-label>Device ID</mat-label>
             <input matInput formControlName="deviceId" placeholder="Enter device ID">
             <mat-error *ngIf="form.get('deviceId')?.hasError('required')">
               Device ID is required
             </mat-error>
             <mat-error *ngIf="form.get('deviceId')?.hasError('minlength')">
               Device ID must be at least 3 characters
             </mat-error>
           </mat-form-field>
         </div>

         <div class="row">
           <mat-form-field appearance="outline" class="form-field">
             <mat-label>Ambulance Unit</mat-label>
             <mat-select formControlName="ambulanceUnit">
               <mat-option *ngFor="let ambulance of ambulances" [value]="ambulance.vehicleNumber">
                 {{ambulance.vehicleNumber}}
               </mat-option>
             </mat-select>
             <mat-error *ngIf="form.get('ambulanceUnit')?.hasError('required')">
               Ambulance unit is required
             </mat-error>
           </mat-form-field>
         </div>

         <div class="row" *ngIf="data">
           <mat-form-field appearance="outline" class="form-field status-field">
             <mat-label>Status</mat-label>
             <mat-select formControlName="status">
               <mat-option value="ACTIVE">Active</mat-option>
               <mat-option value="INACTIVE">Inactive</mat-option>
               <mat-option value="MAINTENANCE">Maintenance</mat-option>
             </mat-select>
           </mat-form-field>
         </div>
       </div>
     </mat-dialog-content>

     <mat-dialog-actions align="end">
       <button mat-button type="button" [mat-dialog-close]="false">Cancel</button>
       <button
         mat-raised-button
         color="primary"
         type="submit"
         [disabled]="form.invalid || form.pristine">
         {{data ? 'Update' : 'Register'}}
       </button>
     </mat-dialog-actions>
   </form>
 `
})
export class AddEditDeviceDialog implements OnInit {
 form: FormGroup;
 ambulances: AmbulanceResponse[] = [];

 constructor(
   private fb: FormBuilder,
   private dialogRef: MatDialogRef<AddEditDeviceDialog>,
   private ambulanceService: AmbulanceService,
   @Inject(MAT_DIALOG_DATA) public data: DeviceResponse | null,
   private snackbarService: SnackbarService
 ) {
   this.form = this.fb.group({
     deviceId: [
       data?.deviceId || '',
       [Validators.required, Validators.minLength(3)]
     ],
     ambulanceUnit: [
       data?.ambulanceUnit || '',
       [Validators.required]
     ]
   });

   if (data) {
     this.form.addControl('status', this.fb.control(data.status || 'ACTIVE'));
   }
 }

 ngOnInit() {
   this.loadAmbulances();
 }

 private loadAmbulances() {
   this.ambulanceService.getAllAmbulances().subscribe({
     next: (response) => {
       if (response.success) {
         this.ambulances = response.data;
         if (this.ambulances.length === 0) {
           this.snackbarService.showSnackbar('No ambulances found', 'Close', {
             duration: 5000,
             panelClass: ['warn-snackbar']
           });
         }
       }
     },
     error: (error) => {
       console.error('Error loading ambulances:', error);
       this.snackbarService.showSnackbar('Error loading ambulances', 'Close', {
         duration: 5000,
         panelClass: ['error-snackbar']
       });
     }
   });
 }

 onSubmit(): void {
   if (this.form.valid) {
     try {
       this.dialogRef.close(this.form.value);
     } catch (error) {
       console.error('Error submitting form:', error);
     }
   } else {
     this.snackbarService.showSnackbar('Please check form errors', 'Close', {
       duration: 3000,
       panelClass: ['warn-snackbar']
     });
   }
 }
}
