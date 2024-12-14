package com.ambulance.hospital.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class HospitalRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String address;
    @NotNull
    private Double latitude;
    @NotNull
    private Double longitude;
    @NotNull
    private Integer totalBeds;
    @NotNull
    private Integer emergencyCapacity;
    private String specialties;
    @NotBlank
    private String contactNumber;
}