package com.ambulance.hospital.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "hospitals")
public class Hospital {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
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