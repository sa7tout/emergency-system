package com.ambulance.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DriverAuthRequest {
    @NotBlank
    private String employeeId;
    @NotBlank
    private String pin;
    @NotBlank
    private String deviceId;
}