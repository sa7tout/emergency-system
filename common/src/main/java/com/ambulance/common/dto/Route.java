package com.ambulance.common.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Route {
    private Long id;
    private Double startLatitude;
    private Double startLongitude;
    private Double endLatitude;
    private Double endLongitude;
    private Double estimatedDuration;
    private String encodedPath;
}