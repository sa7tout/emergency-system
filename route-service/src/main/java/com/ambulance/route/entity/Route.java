package com.ambulance.route.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long emergencyId;
    private Long ambulanceId;
    private Double startLatitude;
    private Double startLongitude;
    private Double endLatitude;
    private Double endLongitude;
    private Double estimatedDuration;
    private Double actualDuration;
    private String encodedPath;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
}