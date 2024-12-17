export enum AmbulanceStatus {
  AVAILABLE = 'AVAILABLE',
  ASSIGNED = 'ASSIGNED',
  EN_ROUTE = 'EN_ROUTE',
  AT_SCENE = 'AT_SCENE',
  TRANSPORTING = 'TRANSPORTING',
  AT_HOSPITAL = 'AT_HOSPITAL',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export interface AmbulanceRegistrationRequest {
  vehicleNumber: string;
  model: string;
  year: number;
  equipmentDetails: string;
  deviceId: string;
}

export interface AmbulanceResponse {
  id: number;
  vehicleNumber: string;
  model: string;
  year: number;
  equipmentDetails: string;
  deviceId: string;
  status: AmbulanceStatus;
  currentLatitude: number;
  currentLongitude: number;
  speed: number;
  active: boolean;
  currentAssignment: string;
  lastUpdated: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface DeviceRegistrationRequest {
  deviceId: string;
  ambulanceUnit: string;
  status?: string;
}

export interface DeviceResponse {
  id: number;
  deviceId: string;
  ambulanceUnit: string;
  status: string;
  registeredAt: string;
  lastPing: string;
}

export interface Employee {
  id: number;
  employeeId: string;
  fullName: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface DeviceAssignmentRequest {
  deviceId: number;
  employeeId: number;
}

export interface DeviceAssignmentResponse {
  id: number;
  deviceId: number;
  employeeId: number;
  employeeName: string;
  deviceStatus: string;
  assignedAt: string;
  active: boolean;
}
