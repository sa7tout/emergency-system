package com.ambulance.emergency.entity;

import com.ambulance.common.enums.EmergencyStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "emergency_cases")
public class EmergencyCase {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double pickupLatitude;
    private Double pickupLongitude;
    private String patientName;
    private String contactNumber;

    @Enumerated(EnumType.STRING)
    private EmergencyStatus status;

    private Long assignedAmbulanceId;
    private Long assignedHospitalId;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}