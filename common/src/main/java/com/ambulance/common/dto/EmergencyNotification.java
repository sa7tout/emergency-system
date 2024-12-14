package com.ambulance.common.dto;

import lombok.Data;
import lombok.Builder;
import org.springframework.util.RouteMatcher;

@Data
@Builder
public class EmergencyNotification {
    private Long emergencyId;
    private Location patientLocation;
    private String patientDetails;
    private Hospital nearestHospital;
    private RouteMatcher.Route suggestedRoute;
}