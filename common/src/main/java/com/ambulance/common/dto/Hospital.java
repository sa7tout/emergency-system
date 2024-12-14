package com.ambulance.common.dto;

import lombok.Data;

@Data
public class Hospital {
    private Long id;
    private String name;
    private String address;
    private Double latitude;
    private Double longitude;
    private Integer availableBeds;
    private Integer emergencyCapacity;
    private Integer currentEmergencyLoad;
}