// app/features/emergency/models/emergency.model.ts
export enum EmergencyStatus {
 PENDING = 'PENDING',
 ASSIGNED = 'ASSIGNED',
 IN_PROGRESS = 'IN_PROGRESS',
 COMPLETED = 'COMPLETED',
 CANCELLED = 'CANCELLED'
}

export interface EmergencyResponse {
 id: number;
 patientName: string;
 status: EmergencyStatus;
 assignedAmbulanceId?: number;
 assignedHospitalId?: number;
 createdAt: string;
 updatedAt: string;
}
