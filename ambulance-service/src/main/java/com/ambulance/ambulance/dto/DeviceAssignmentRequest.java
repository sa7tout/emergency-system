package com.ambulance.ambulance.dto;

import lombok.Data;

@Data
public class DeviceAssignmentRequest {
    private Long deviceId;
    private Long employeeId;
}