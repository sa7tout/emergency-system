package com.ambulance.ambulance.dto;

import com.ambulance.common.enums.AmbulanceStatus;
import lombok.Data;

@Data
public class AmbulanceUpdateRequest {
    private String vehicleNumber;
    private String model;
    private Integer year;
    private String equipmentDetails;
    private String deviceId;
    private AmbulanceStatus status;
    private String currentAssignment;
    private Boolean active;
}