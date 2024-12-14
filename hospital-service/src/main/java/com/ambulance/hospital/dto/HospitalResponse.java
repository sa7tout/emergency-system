package com.ambulance.hospital.dto;

import lombok.Data;

@Data
public class HospitalResponse {
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Integer totalBeds;
    private Integer availableBeds;
    private Integer emergencyCapacity;
    private Integer currentEmergencyLoad;
    private Boolean isActive;
    private String specialties;
    private String contactNumber;
}