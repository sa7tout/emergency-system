package com.ambulance.emergency.dto;

import com.ambulance.common.enums.EmergencyStatus;
import lombok.Data;

@Data
public class UpdateEmergencyRequest {
    private EmergencyStatus status;
    private Long assignedAmbulanceId;
    private Long assignedHospitalId;
    private String patientName;
    private String contactNumber;
    private Double pickupLatitude;
    private Double pickupLongitude;
}