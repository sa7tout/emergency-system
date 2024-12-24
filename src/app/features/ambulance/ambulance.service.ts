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
    return this.apiService.get<ApiResponse<AmbulanceResponse[]>>('ambulance', '/ambulances');
  }

  getActiveAmbulances() {
    return this.apiService.get<AmbulanceResponse[]>('ambulance', '/ambulances/active');
  }

  registerAmbulance(data: AmbulanceRegistrationRequest) {
    return this.apiService.post<AmbulanceResponse>('ambulance', '/ambulances', data);
  }

  updateAmbulance(id: number, data: Partial<AmbulanceResponse>) {
    return this.apiService.patch<AmbulanceResponse>('ambulance', `/ambulances/${id}`, data);
  }

  getLocation(id: number) {
    return this.apiService.get<Location>('ambulance', `/ambulances/${id}/location`);
  }

  updateLocation(id: number, location: Location) {
    return this.apiService.post('ambulance', `/ambulances/${id}/location`, location);
  }

  getLocationHistory(id: number, startTime: Date, endTime: Date) {
    const params = new URLSearchParams({
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString()
    });
    return this.apiService.get<Location[]>('ambulance', `/ambulances/${id}/history?${params}`);
  }

  // Device endpoints
  getAllDevices() {
    return this.apiService.get<ApiResponse<DeviceResponse[]>>('ambulance', '/ambulances/devices');
  }


  registerDevice(data: DeviceRegistrationRequest) {
    return this.apiService.post<DeviceResponse>('ambulance', '/ambulances/devices', data);
  }

  getDevice(id: number) {
    return this.apiService.get<DeviceResponse>('ambulance', `/ambulances/devices/${id}`);
  }

  updateDeviceStatus(id: number, status: string) {
    return this.apiService.patch<DeviceResponse>('ambulance', `/ambulances/devices/${id}`, { status });
  }

  updateDevicePing(id: number) {
    return this.apiService.post<DeviceResponse>('ambulance', `/ambulances/devices/${id}/ping`, {});
  }

  deactivateDevice(id: number) {
    return this.apiService.delete<void>('ambulance', `/ambulances/devices/${id}`);
  }

  assignDeviceToDriver(data: DeviceAssignmentRequest) {
      return this.apiService.post<DeviceAssignmentResponse>('ambulance', '/ambulances/devices/assignments', data);
  }

  getDeviceAssignments() {
    return this.apiService.get<DeviceAssignmentResponse[]>('ambulance', '/ambulances/devices/assignments');
  }

  deactivateAssignment(id: number) {
    return this.apiService.delete<void>('ambulance', `/ambulances/devices/assignments/${id}`);
  }

  getAvailableDrivers() {
    return this.apiService.get<ApiResponse<Employee[]>>('ambulance', '/ambulances/drivers').pipe(
      map((response) => response.data)
    );
  }
}
