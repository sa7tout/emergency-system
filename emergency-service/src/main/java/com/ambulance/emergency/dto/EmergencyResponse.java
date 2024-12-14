package com.ambulance.emergency.dto;

import com.ambulance.common.enums.EmergencyStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EmergencyResponse {
    private Long id;
    private Double pickupLatitude;
    private Double pickupLongitude;
    private String patientName;
    private String contactNumber;
    private EmergencyStatus status;
    private Long assignedAmbulanceId;
    private Long assignedHospitalId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}