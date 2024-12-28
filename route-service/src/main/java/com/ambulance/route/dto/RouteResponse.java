// RouteResponse.java
package com.ambulance.route.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class RouteResponse {
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
    private LocalDateTime updatedAt;
    private LocalDateTime createdAt;
    private String status;
}