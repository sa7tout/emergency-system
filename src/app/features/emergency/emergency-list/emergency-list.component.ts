import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { EmergencyService } from '../emergency.service';
import { EmergencyResponse } from '../models/emergency.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { EmergencyDetailsDialog } from '../dialogs/emergency-details.dialog';
import { EmergencyEditDialog } from '../dialogs/emergency-edit.dialog';

@Component({
  selector: 'app-emergency-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatDialogModule,
    MatIconModule
  ],
  templateUrl: './emergency-list.component.html',
  styleUrls: ['./emergency-list.component.scss']
})
export class EmergencyListComponent {
  emergencies$: Observable<EmergencyResponse[]>;
  displayedColumns = ['id', 'patientName', 'status', 'assignedAmbulance', 'assignedHospital', 'actions'];

  constructor(
    private emergencyService: EmergencyService,
    private dialog: MatDialog
  ) {
    this.emergencies$ = this.emergencyService.getEmergencies();
  }

  getPendingCount(): Observable<number> {
    return this.emergencies$.pipe(
      map(emergencies => emergencies.filter(e => e.status === 'PENDING').length)
    );
  }

  getInProgressCount(): Observable<number> {
    return this.emergencies$.pipe(
      map(emergencies => emergencies.filter(e => e.status === 'IN_PROGRESS').length)
    );
  }

  getCompletedCount(): Observable<number> {
    return this.emergencies$.pipe(
      map(emergencies => emergencies.filter(e => e.status === 'COMPLETED').length)
    );
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'PENDING': 'warn',
      'ASSIGNED': 'accent',
      'IN_PROGRESS': 'primary',
      'COMPLETED': 'primary',
      'CANCELLED': 'default'
    };
    return colors[status] || 'default';
  }

  viewDetails(emergency: EmergencyResponse) {
    this.dialog.open(EmergencyDetailsDialog, {
      width: '800px',
      data: emergency
    });
  }

  edit(emergency: EmergencyResponse) {
    const dialogRef = this.dialog.open(EmergencyEditDialog, {
      width: '600px',
      data: emergency
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.emergencyService.refreshEmergencies();
      }
    });
  }
}
