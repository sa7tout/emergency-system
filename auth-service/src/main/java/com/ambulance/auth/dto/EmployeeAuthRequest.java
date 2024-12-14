package com.ambulance.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EmployeeAuthRequest {
    @NotBlank(message = "Employee ID is required")
    private String employeeId;

    @NotBlank(message = "PIN is required")
    private String pin;

    @NotBlank(message = "Device ID is required")
    private String deviceId;
}