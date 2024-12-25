import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmergencyService } from '../emergency.service';
import { AmbulanceService } from '../../ambulance/ambulance.service';
import { HospitalService } from '../../hospital/hospital.service';
import { CreateEmergencyRequest } from '../models/emergency.model';
import { AmbulanceResponse } from '../../ambulance/models/ambulance.model';
import { HospitalResponse } from '../../hospital/models/hospital.model';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
 selector: 'app-create-emergency-dialog',
 standalone: true,
 imports: [
   CommonModule,
   MatDialogModule,
   MatButtonModule,
   MatFormFieldModule,
   MatInputModule,
   MatSelectModule,
   ReactiveFormsModule
 ],
 template: `
   <div class="dialog-container">
     <h2 mat-dialog-title class="dialog-title">Create Emergency Case</h2>

     <form [formGroup]="form" (ngSubmit)="onSubmit()" class="form-container">
       <mat-dialog-content>
         <!-- Patient Information -->
         <div class="section">
           <h3 class="section-title">Patient Information</h3>
           <div class="grid-2-cols">
             <mat-form-field appearance="outline">
               <mat-label>Patient Name</mat-label>
               <input matInput formControlName="patientName" required
                      placeholder="Enter patient name">
               <mat-error *ngIf="form.get('patientName')?.hasError('required')">
                 Patient name is required
               </mat-error>
             </mat-form-field>

             <mat-form-field appearance="outline">
               <mat-label>Contact Number</mat-label>
               <input matInput formControlName="contactNumber"
                      placeholder="+1234567890">
             </mat-form-field>
           </div>
         </div>

         <!-- Location Information -->
         <div class="section">
           <h3 class="section-title">Pickup Location</h3>
           <div class="grid-2-cols">
             <mat-form-field appearance="outline">
               <mat-label>Latitude</mat-label>
               <input matInput type="number" formControlName="pickupLatitude"
                      required placeholder="Enter latitude">
               <mat-error *ngIf="form.get('pickupLatitude')?.hasError('required')">
                 Latitude is required
               </mat-error>
             </mat-form-field>

             <mat-form-field appearance="outline">
               <mat-label>Longitude</mat-label>
               <input matInput type="number" formControlName="pickupLongitude"
                      required placeholder="Enter longitude">
               <mat-error *ngIf="form.get('pickupLongitude')?.hasError('required')">
                 Longitude is required
               </mat-error>
             </mat-form-field>
           </div>
         </div>

         <!-- Resource Assignment -->
         <div class="section">
           <h3 class="section-title">Resource Assignment</h3>
           <div class="grid-2-cols">
             <mat-form-field appearance="outline">
               <mat-label>Ambulance</mat-label>
               <mat-select formControlName="assignedAmbulanceId">
                 <mat-option *ngFor="let ambulance of ambulances" [value]="ambulance.id">
                   {{ambulance.vehicleNumber}}
                 </mat-option>
               </mat-select>
               <mat-hint *ngIf="ambulances.length === 0" class="warning-hint">
                 No available ambulances
               </mat-hint>
             </mat-form-field>

             <mat-form-field appearance="outline">
               <mat-label>Hospital</mat-label>
               <mat-select formControlName="assignedHospitalId">
                 <mat-option *ngFor="let hospital of hospitals" [value]="hospital.id">
                   {{hospital.name}}
                 </mat-option>
               </mat-select>
               <mat-hint *ngIf="hospitals.length === 0" class="warning-hint">
                 No hospitals available
               </mat-hint>
             </mat-form-field>
           </div>
         </div>
       </mat-dialog-content>

       <mat-dialog-actions align="end">
         <button mat-button mat-dialog-close type="button">Cancel</button>
         <button mat-raised-button color="warn" type="submit"
                 [disabled]="!form.valid || !ambulances.length || !hospitals.length">
           Create Emergency
         </button>
       </mat-dialog-actions>
     </form>
   </div>
 `,
 styles: [`
   .dialog-container {
       padding: 16px;
       max-width: 800px;
       max-height: 600px;
       overflow-y: auto;
     }

   .dialog-title {
     margin-bottom: 24px;
     color: #d32f2f;
     font-size: 24px;
   }

   .form-container {
     display: flex;
     flex-direction: column;
     gap: 24px;
   }

   .section {
     margin-bottom: 32px;
   }

   .section-title {
     font-size: 18px;
     font-weight: 500;
     margin-bottom: 16px;
     color: rgba(0, 0, 0, 0.87);
   }

   .grid-2-cols {
     display: grid;
     grid-template-columns: 1fr 1fr;
     gap: 16px;
   }

   mat-form-field {
     width: 100%;
   }

   .warning-hint {
     color: #f44336;
   }

   mat-dialog-actions {
     padding-top: 24px;
     margin-bottom: 0;
   }
 `]
})
export class CreateEmergencyDialog implements OnInit {
 form: FormGroup;
 ambulances: AmbulanceResponse[] = [];
 hospitals: HospitalResponse[] = [];

 constructor(
   private fb: FormBuilder,
   private dialogRef: MatDialogRef<CreateEmergencyDialog>,
   private emergencyService: EmergencyService,
   private ambulanceService: AmbulanceService,
   private hospitalService: HospitalService,
   private snackbar: SnackbarService
 ) {
   this.form = this.fb.group({
     patientName: ['', [Validators.required, Validators.minLength(2)]],
     contactNumber: ['', [Validators.pattern('^\\+?[1-9]\\d{1,14}$')]],
     pickupLatitude: ['', [Validators.required, Validators.min(-90), Validators.max(90)]],
     pickupLongitude: ['', [Validators.required, Validators.min(-180), Validators.max(180)]],
     assignedAmbulanceId: [''],
     assignedHospitalId: ['']
   });
 }

 ngOnInit() {
   this.loadAmbulances();
   this.loadHospitals();
 }

 loadAmbulances() {
   this.ambulanceService.getAllAmbulances().subscribe({
     next: (response: any) => {
       this.ambulances = Array.isArray(response)
         ? response.filter((ambulance: AmbulanceResponse) =>
             ambulance.status === 'AVAILABLE' && ambulance.active)
         : (response?.data || []).filter((ambulance: AmbulanceResponse) =>
             ambulance.status === 'AVAILABLE' && ambulance.active);

       if (this.ambulances.length === 0) {
         this.snackbar.showSnackbar('No available ambulances', 'Close', {
           duration: 5000,
           panelClass: ['warning-snackbar']
         });
       }
     },
     error: (error) => {
       this.snackbar.showSnackbar(
         'Failed to load ambulances',
         'Close',
         {
           duration: 5000,
           panelClass: ['error-snackbar']
         }
       );
       console.error('Error loading ambulances:', error);
     }
   });
 }

 loadHospitals() {
   this.hospitalService.getHospitals().subscribe({
     next: (response: any) => {
       this.hospitals = Array.isArray(response)
         ? response.filter((hospital: HospitalResponse) => hospital.isActive)
         : (response?.data || []).filter((hospital: HospitalResponse) => hospital.isActive);

       if (this.hospitals.length === 0) {
         this.snackbar.showSnackbar('No hospitals available', 'Close', {
           duration: 5000,
           panelClass: ['warning-snackbar']
         });
       }
     },
     error: (error) => {
       this.snackbar.showSnackbar('Failed to load hospitals', 'Close', {
         duration: 5000,
         panelClass: ['error-snackbar']
       });
     }
   });
 }

 onSubmit() {
   if (this.form.valid) {
     const data: CreateEmergencyRequest = this.form.value;

     this.emergencyService.createEmergency(data).subscribe({
       next: () => {
         this.snackbar.showSnackbar(
           'Emergency case created successfully',
           'Close',
           {
             duration: 3000,
             panelClass: ['success-snackbar']
           }
         );
         this.dialogRef.close(true);
       },
       error: (error) => {
         this.snackbar.showSnackbar(
           error.error?.message || 'Error creating emergency case',
           'Close',
           {
             duration: 5000,
             panelClass: ['error-snackbar']
           }
         );
       }
     });
   }
 }
}
