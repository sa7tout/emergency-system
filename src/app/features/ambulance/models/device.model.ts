export interface Device {
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
  deviceAssignments?: DeviceAssignmentResponse[];
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
