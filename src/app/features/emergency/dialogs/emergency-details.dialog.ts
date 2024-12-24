import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { EmergencyResponse } from '../models/emergency.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-emergency-details-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatChipsModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon class="dialog-icon" color="warn">emergency</mat-icon>
      Emergency Case Details
    </h2>
    <mat-dialog-content class="dialog-content">
      <div class="details-container">
        <!-- Left Column -->
        <div class="column">
          <!-- Patient Information -->
          <section class="details-section">
            <mat-icon color="primary">person</mat-icon>
            <h3>Patient Information</h3>
            <p><strong>Name:</strong> {{data.patientName}}</p>
            <p><strong>Contact:</strong> {{data.contactNumber || 'N/A'}}</p>
          </section>

          <!-- Assignment Details -->
          <section class="details-section">
            <mat-icon color="accent">directions_car</mat-icon>
            <h3>Assignment Details</h3>
            <p><strong>Ambulance:</strong> {{data.assignedAmbulanceId || 'Not assigned'}}</p>
            <p><strong>Hospital:</strong> {{data.assignedHospitalId || 'Not assigned'}}</p>
          </section>
        </div>

        <!-- Right Column -->
        <div class="column">
          <!-- Emergency Status -->
          <section class="details-section">
            <mat-icon color="warn">priority_high</mat-icon>
            <h3>Emergency Status</h3>
            <mat-chip [color]="getStatusColor(data.status)" selected class="status-chip">
              {{data.status}}
            </mat-chip>
          </section>

          <!-- Timestamps -->
          <section class="details-section">
            <mat-icon color="primary">schedule</mat-icon>
            <h3>Timestamps</h3>
            <p><strong>Created:</strong> {{data.createdAt | date:'medium'}}</p>
            <p><strong>Last Updated:</strong> {{data.updatedAt | date:'medium'}}</p>
          </section>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-stroked-button mat-dialog-close color="primary">Close</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .dialog-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 1.5rem;
        font-weight: bold;
      }

      .dialog-icon {
        font-size: 1.5rem;
        margin: 8px; // Added margin
      }

      .dialog-content {
        padding: 16px;
      }

      .details-container {
        display: flex;
        gap: 16px;
        margin-top: 8px;
      }

      .column {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }

      .details-section {
        background: #f9f9f9;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .details-section mat-icon {
        vertical-align: middle;
        margin-right: 8px;
      }

      .details-section h3 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .status-chip {
        font-size: 0.9rem;
        padding: 4px 12px;
        text-transform: capitalize;
      }

      .dialog-actions {
        margin-top: 16px;
        padding: 8px;
      }
    `,
  ],
})
export class EmergencyDetailsDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: EmergencyResponse) {}

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      PENDING: 'warn',
      ASSIGNED: 'accent',
      IN_PROGRESS: 'primary',
      COMPLETED: 'primary',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  }
}
