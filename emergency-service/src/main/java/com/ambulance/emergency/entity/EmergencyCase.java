package com.ambulance.emergency.entity;

import com.ambulance.common.enums.EmergencyStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "emergency_cases")
public class EmergencyCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(nullable = false)
    private Double pickupLatitude;

    @NotNull
    @Column(nullable = false)
    private Double pickupLongitude;

    @NotNull
    @Size(min = 2, max = 100)
    @Column(nullable = false)
    private String patientName;

    @NotNull
    @Pattern(regexp = "^\\+?[1-9]\\d{1,14}$")
    @Column(nullable = false)
    private String contactNumber;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EmergencyStatus status;

    private Long assignedAmbulanceId;
    private Long assignedHospitalId;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @NotNull
    @Column(nullable = false)
    private LocalDateTime updatedAt;
}