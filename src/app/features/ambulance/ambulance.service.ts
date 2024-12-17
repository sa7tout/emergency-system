import { Injectable } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { map } from 'rxjs/operators';
import {
  AmbulanceRegistrationRequest,
  AmbulanceResponse,
  Location,
  DeviceRegistrationRequest,
  DeviceResponse,
  DeviceAssignmentRequest,
  DeviceAssignmentResponse,
  Employee
} from './models/ambulance.model';

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({ providedIn: 'root' })
export class AmbulanceService {
  constructor(private apiService: ApiService) {}

  // Ambulance endpoints
  getAllAmbulances() {
    return this.apiService.get<ApiResponse<AmbulanceResponse[]>>('ambulance', '/api/ambulances');
  }

  getActiveAmbulances() {
    return this.apiService.get<AmbulanceResponse[]>('ambulance', '/api/ambulances/active');
  }

  registerAmbulance(data: AmbulanceRegistrationRequest) {
    return this.apiService.post<AmbulanceResponse>('ambulance', '/api/ambulances', data);
  }

  updateAmbulance(id: number, data: Partial<AmbulanceResponse>) {
    return this.apiService.patch<AmbulanceResponse>('ambulance', `/api/ambulances/${id}`, data);
  }

  getLocation(id: number) {
    return this.apiService.get<Location>('ambulance', `/api/ambulances/${id}/location`);
  }

  updateLocation(id: number, location: Location) {
    return this.apiService.post('ambulance', `/api/ambulances/${id}/location`, location);
  }

  getLocationHistory(id: number, startTime: Date, endTime: Date) {
    const params = new URLSearchParams({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    });
    return this.apiService.get<Location[]>('ambulance', `/api/ambulances/${id}/history?${params}`);
  }

  // Device endpoints
  getAllDevices() {
    return this.apiService.get<ApiResponse<DeviceResponse[]>>('ambulance', '/api/ambulances/devices');
  }


  registerDevice(data: DeviceRegistrationRequest) {
    return this.apiService.post<DeviceResponse>('ambulance', '/api/ambulances/devices', data);
  }

  getDevice(id: number) {
    return this.apiService.get<DeviceResponse>('ambulance', `/api/ambulances/devices/${id}`);
  }

  updateDeviceStatus(id: number, status: string) {
    return this.apiService.patch<DeviceResponse>('ambulance', `/api/ambulances/devices/${id}`, { status });
  }

  updateDevicePing(id: number) {
    return this.apiService.post<DeviceResponse>('ambulance', `/api/ambulances/devices/${id}/ping`, {});
  }

  deactivateDevice(id: number) {
    return this.apiService.delete<void>('ambulance', `/api/ambulances/devices/${id}`);
  }

  assignDeviceToDriver(data: DeviceAssignmentRequest) {
      return this.apiService.post<DeviceAssignmentResponse>('ambulance', '/api/ambulances/devices/assignments', data);
  }

  getDeviceAssignments() {
    return this.apiService.get<DeviceAssignmentResponse[]>('ambulance', '/api/ambulances/devices/assignments');
  }

  deactivateAssignment(id: number) {
    return this.apiService.delete<void>('ambulance', `/api/ambulances/devices/assignments/${id}`);
  }

  getAvailableDrivers() {
    return this.apiService.get<ApiResponse<Employee[]>>('ambulance', '/api/ambulances/drivers').pipe(
      map((response) => response.data)
    );
  }
}
