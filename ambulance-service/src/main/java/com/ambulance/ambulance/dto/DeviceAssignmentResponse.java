package com.ambulance.ambulance.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class DeviceAssignmentResponse {
    private Long id;
    private Long deviceId;
    private Long employeeId;
    private String employeeName;
    private String deviceStatus;
    private LocalDateTime assignedAt;
}