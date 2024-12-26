import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
 selector: 'app-add-employee-dialog',
 standalone: true,
 imports: [
   CommonModule,
   FormsModule,
   MatDialogModule,
   MatFormFieldModule,
   MatInputModule,
   MatSelectModule,
   MatButtonModule,
   MatSnackBarModule
 ],
 template: `
  <h2 mat-dialog-title>Register New Driver</h2>
  <mat-dialog-content>
    <form #form="ngForm" class="form-container">
      <div class="form-row">
        <mat-form-field>
          <mat-label>Employee ID</mat-label>
          <input matInput [(ngModel)]="data.employeeId" name="employeeId" required>
        </mat-form-field>

        <mat-form-field>
          <mat-label>Full Name</mat-label>
          <input matInput [(ngModel)]="data.fullName" name="fullName" required>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field>
          <mat-label>PIN (4-6 digits)</mat-label>
          <input matInput type="password" [(ngModel)]="data.pin" name="pin" required pattern="^\\d{4,6}$">
        </mat-form-field>

        <mat-form-field>
          <mat-label>Role</mat-label>
          <mat-select [(ngModel)]="data.role" name="role" required>
            <mat-option value="DRIVER">Driver</mat-option>
            <mat-option value="PARAMEDIC">Paramedic</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </form>
  </mat-dialog-content>
  <mat-dialog-actions align="end">
    <button mat-button (click)="dialogRef.close()">Cancel</button>
    <button mat-raised-button color="primary"
            [disabled]="!form.valid"
            (click)="onSubmit()">
      Register
    </button>
  </mat-dialog-actions>
 `,
 styles: [`
  .error-snackbar {
    background-color: #f44336;
    color: white;
  }

  .form-container {
    padding: 20px;
  }

  .form-row {
    display: flex;
    gap: 20px;
    margin-bottom: 15px;
  }

  mat-form-field {
    flex: 1;
  }
 `]
})
export class AddEmployeeDialogComponent {
 @ViewChild('form') form!: NgForm;

 data = {
   employeeId: '',
   fullName: '',
   pin: '',
   role: 'DRIVER'
 };

 constructor(
   public dialogRef: MatDialogRef<AddEmployeeDialogComponent>,
   private snackbar: SnackbarService
 ) {}

 onSubmit(): void {
   if (this.form.valid) {
     this.dialogRef.close(this.data);
     this.snackbar.showSnackbar('Driver registered successfully', 'Close', {
       duration: 3000
     });
   } else {
     this.snackbar.showSnackbar('Please fill all required fields correctly', 'Close', {
       duration: 3000,
       panelClass: ['error-snackbar']
     });
   }
 }
}
