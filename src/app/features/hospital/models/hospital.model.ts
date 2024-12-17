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
