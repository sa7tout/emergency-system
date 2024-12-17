package com.ambulance.ambulance.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "ambulance_devices")
@Data
public class DeviceEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String deviceId;

    @Column(nullable = false)
    private String ambulanceUnit;

    @Column(length = 20)
    private String status = "ACTIVE";

    private LocalDateTime registeredAt = LocalDateTime.now();
    private LocalDateTime lastPing;
}