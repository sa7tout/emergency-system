package com.ambulance.auth.dto;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class EmployeeResponse {
    private String employeeId;
    private String fullName;
    private String role;
    private String token;
    private List<String> assignedDevices;
}