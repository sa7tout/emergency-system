import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { EmergencyResponse, CreateEmergencyRequest, UpdateEmergencyRequest} from './models/emergency.model';

interface ApiResponse<T> {
 success: boolean;
 message: string;
 data: T;
}

@Injectable({
 providedIn: 'root'
})
export class EmergencyService {
 private emergenciesSubject = new BehaviorSubject<EmergencyResponse[]>([]);

 constructor(private apiService: ApiService) {
   this.loadInitialEmergencies();
 }

 private loadInitialEmergencies(): void {
   this.apiService.get<ApiResponse<EmergencyResponse[]>>('emergency', '/emergencies')
     .pipe(
       map(response => response.data),
       catchError(error => {
         console.error('Failed to load emergencies', error);
         return [];
       })
     )
     .subscribe({
       next: (emergencies) => this.emergenciesSubject.next(emergencies)
     });
 }

 getEmergencies(): Observable<EmergencyResponse[]> {
   return this.emergenciesSubject.asObservable();
 }

 createEmergency(data: CreateEmergencyRequest): Observable<EmergencyResponse> {
   return this.apiService.post<EmergencyResponse>('emergency', '/emergencies', data);
 }

 updateEmergency(id: number, data: UpdateEmergencyRequest): Observable<EmergencyResponse> {
    return this.apiService.patch<EmergencyResponse>('emergency', `/emergencies/${id}`, data);
  }

 refreshEmergencies(): void {
   this.loadInitialEmergencies();
 }
}
