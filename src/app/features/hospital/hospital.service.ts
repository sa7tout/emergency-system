import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Observable, map } from 'rxjs';

export interface HospitalRequest {
 name: string;
 address: string;
 latitude: number;
 longitude: number;
 totalBeds: number;
 emergencyCapacity: number;
 specialties?: string;
 contactNumber: string;
}

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

@Injectable({
 providedIn: 'root'
})
export class HospitalService {
 constructor(private apiService: ApiService) {}

 getHospitals(): Observable<HospitalResponse[]> {
   return this.apiService
     .get<{ success: boolean; message: string; data: HospitalResponse[] }>('hospital', '/hospitals/available')
     .pipe(
       map(response => (Array.isArray(response.data) ? response.data : []))
     );
 }


 createHospital(data: HospitalRequest): Observable<HospitalResponse> {
   return this.apiService.post<HospitalResponse>('hospital', '/hospitals', data);
 }

 updateHospital(id: number, data: HospitalRequest): Observable<HospitalResponse> {
   return this.apiService.put<HospitalResponse>('hospital', `/hospitals/${id}`, data);
 }

 deleteHospital(id: number): Observable<void> {
   return this.apiService.delete<void>('hospital', `/hospitals/${id}`);
 }

 getHospitalById(id: number): Observable<HospitalResponse> {
   return this.apiService.get<HospitalResponse>('hospital', `/hospitals/${id}`);
 }
}
