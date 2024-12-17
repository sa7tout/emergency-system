import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';

export interface HospitalResponse {
 id: number;
 name: string;
 address: string;
 latitude: number;
 longitude: number;
 totalBeds: number;
 availableBeds: number;
 emergencyCapacity: number;
 currentEmergencyLoad: number;
 isActive: boolean;
 specialties: string;
 contactNumber: string;
}

@Injectable({ providedIn: 'root' })
export class HospitalService {
 constructor(private apiService: ApiService) {}

 getHospitals() {
   return this.apiService.get<HospitalResponse[]>('hospital', '/api/hospitals');
 }

 getAvailableHospitals() {
   return this.apiService.get<HospitalResponse[]>('hospital', '/api/hospitals/available');
 }

 updateCapacity(id: number, availableBeds: number, currentLoad: number) {
   const queryParams = `availableBeds=${availableBeds}&currentLoad=${currentLoad}`;
   return this.apiService.put<HospitalResponse>('hospital', `/api/hospitals/${id}/capacity?${queryParams}`, {});
 }
}
