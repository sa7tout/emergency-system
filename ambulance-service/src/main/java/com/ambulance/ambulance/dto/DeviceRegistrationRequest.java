package com.ambulance.ambulance.dto;

import lombok.Data;

@Data
public class DeviceRegistrationRequest {
    private String deviceId;
    private String ambulanceUnit;
    private String status;
}