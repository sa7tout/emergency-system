package com.ambulance.ambulance.dto;

import lombok.Data;

@Data
public class AmbulanceRegistrationRequest {
    private String vehicleNumber;
    private String model;
    private Integer year;
    private String equipmentDetails;
    private String deviceId;
}