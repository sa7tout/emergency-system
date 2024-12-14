package com.ambulance.emergency.dto;

import lombok.Data;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Data
public class CreateEmergencyRequest {
    @NotNull
    private Double pickupLatitude;
    @NotNull
    private Double pickupLongitude;
    @NotNull
    private String patientName;
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
    private String contactNumber;
}