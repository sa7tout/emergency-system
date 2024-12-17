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
}
