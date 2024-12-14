// RouteRequest.java
package com.ambulance.route.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RouteRequest {
    @NotNull
    private Long emergencyId;
    @NotNull
    private Long ambulanceId;
    @NotNull
    private Double startLatitude;
    @NotNull
    private Double startLongitude;
    @NotNull
    private Double endLatitude;
    @NotNull
    private Double endLongitude;
}