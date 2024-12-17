import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule } from '@angular/material/dialog';
import { EmergencyService } from '../emergency.service';
import { EmergencyResponse } from '../models/emergency.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
 selector: 'app-emergency-list',
 standalone: true,
 imports: [CommonModule, MatTableModule, MatButtonModule, MatChipsModule, MatDialogModule],
 templateUrl: './emergency-list.component.html',
 styleUrls: ['./emergency-list.component.scss']
})
export class EmergencyListComponent implements OnInit {
 emergencies$: Observable<EmergencyResponse[]>;
 displayedColumns = ['id', 'patientName', 'status', 'assignedAmbulance', 'assignedHospital', 'actions'];

 constructor(private emergencyService: EmergencyService) {
   this.emergencies$ = this.emergencyService.getEmergencies();
 }

 ngOnInit() {}

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
   // Implement view details
 }

 assign(emergency: EmergencyResponse) {
   // Implement assignment dialog
 }
}
