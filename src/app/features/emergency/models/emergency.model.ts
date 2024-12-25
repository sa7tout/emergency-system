// src/app/features/emergency/models/emergency.model.ts
export interface EmergencyResponse {
  id: number;
  pickupLatitude: number;
  pickupLongitude: number;
  patientName: string;
  contactNumber: string;
  status: 'PENDING' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  assignedAmbulanceId: number;
  assignedHospitalId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmergencyRequest {
  pickupLatitude: number;
  pickupLongitude: number;
  patientName: string;
  contactNumber?: string;
  assignedAmbulanceId: number;
  assignedHospitalId: number;
}

export enum EmergencyStatus {
  PENDING = 'PENDING',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface UpdateEmergencyRequest {
  status: EmergencyStatus;
  patientName: string;
  contactNumber?: string;
  pickupLatitude: number;
  pickupLongitude: number;
  assignedAmbulanceId?: number;
  assignedHospitalId?: number;
}

