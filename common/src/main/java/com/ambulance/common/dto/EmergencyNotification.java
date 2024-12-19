package com.ambulance.common.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class EmergencyNotification {
    private Long emergencyId;
    private Location patientLocation;
    private String patientDetails;
    private Hospital nearestHospital;
    private Long assignedAmbulanceId;
    private String assignedDriverName;
}