package com.ambulance.ambulance.entity;

import com.ambulance.common.enums.AmbulanceStatus;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "ambulances")
public class AmbulanceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String vehicleNumber;

    @Enumerated(EnumType.STRING)
    private AmbulanceStatus status;

    private Double currentLatitude;
    private Double currentLongitude;
    private Double speed;
    private Double heading;
    private String deviceId;
    private Boolean active;
    private String currentAssignment;
    private LocalDateTime lastUpdated;
    private LocalDateTime maintenanceDate;
    private String model;
    private Integer year;
    private String equipmentDetails;
}