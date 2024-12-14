package com.ambulance.ambulance.dto;

import com.ambulance.common.enums.AmbulanceStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AmbulanceResponse {
    private Long id;
    private String vehicleNumber;
    private AmbulanceStatus status;
    private Double currentLatitude;
    private Double currentLongitude;
    private Double speed;
    private Boolean active;
    private String currentAssignment;
    private LocalDateTime lastUpdated;
}