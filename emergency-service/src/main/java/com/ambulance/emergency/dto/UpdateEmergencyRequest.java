package com.ambulance.emergency.dto;

import com.ambulance.common.enums.EmergencyStatus;
import lombok.Data;

@Data
public class UpdateEmergencyRequest {
    private EmergencyStatus status;
    private Long assignedAmbulanceId;
    private Long assignedHospitalId;
}