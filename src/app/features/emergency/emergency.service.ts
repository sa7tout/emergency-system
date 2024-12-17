// src/app/features/emergency/emergency.service.ts
import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { EmergencyResponse, CreateEmergencyRequest } from './models/emergency.model';

@Injectable({
 providedIn: 'root'
})
export class EmergencyService {
 private emergenciesSubject = new BehaviorSubject<EmergencyResponse[]>([]);
 private socket!: WebSocket;

 constructor(private apiService: ApiService) {
   this.setupWebSocket();
 }

 private setupWebSocket(): void {
   this.socket = new WebSocket('ws://localhost:8093/emergency/api/v1/ws');

   this.socket.onmessage = (event) => {
     const emergency: EmergencyResponse = JSON.parse(event.data);
     const current = this.emergenciesSubject.value;
     this.emergenciesSubject.next([...current, emergency]);
   };

   this.socket.onerror = (error) => {
     console.error('WebSocket error:', error);
   };
 }

 getEmergencies(): Observable<EmergencyResponse[]> {
   return this.emergenciesSubject.asObservable();
 }

 createEmergency(data: CreateEmergencyRequest): Observable<EmergencyResponse> {
   return this.apiService.post<EmergencyResponse>('emergency', '/emergencies', data);
 }
}
