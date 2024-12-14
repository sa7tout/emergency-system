package com.ambulance.ambulance.dto;

import com.ambulance.common.enums.AmbulanceStatus;
import lombok.Data;

@Data
public class AmbulanceUpdateRequest {
    private AmbulanceStatus status;
    private String currentAssignment;
    private Boolean active;
}