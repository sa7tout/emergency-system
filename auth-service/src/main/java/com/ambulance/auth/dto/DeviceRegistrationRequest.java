package com.ambulance.auth.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class DeviceRegistrationRequest {
    @NotBlank
    private String deviceId;
    @NotBlank
    private String ambulanceUnit;
}