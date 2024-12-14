package com.ambulance.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverRegistrationRequest {
    @NotBlank
    private String employeeId;
    @NotBlank
    private String fullName;
    @NotBlank
    private String pin;
    @NotBlank
    private String deviceId;  // Which ambulance device they're assigned to
}