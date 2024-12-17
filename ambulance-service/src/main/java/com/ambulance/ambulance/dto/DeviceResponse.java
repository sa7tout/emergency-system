package com.ambulance.ambulance.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DeviceResponse {
    private Long id;
    private String deviceId;
    private String ambulanceUnit;
    private String status;
    private LocalDateTime registeredAt;
    private LocalDateTime lastPing;
}