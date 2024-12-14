package com.ambulance.auth.service;

import com.ambulance.auth.dto.EmployeeAuthRequest;
import com.ambulance.auth.dto.EmployeeResponse;
import com.ambulance.auth.entity.AmbulanceDevice;
import com.ambulance.auth.entity.Employee;
import com.ambulance.auth.repository.DeviceRepository;
import com.ambulance.auth.repository.EmployeeRepository;
import com.ambulance.auth.repository.DeviceAssignmentRepository;
import com.ambulance.common.exception.BusinessException;
import com.ambulance.common.security.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployeeAuthService {
    private final EmployeeRepository employeeRepository;
    private final DeviceRepository deviceRepository;
    private final DeviceAssignmentRepository assignmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public EmployeeResponse authenticateEmployee(EmployeeAuthRequest request) {
        Employee employee = employeeRepository.findByEmployeeId(request.getEmployeeId())
                .orElseThrow(() -> new BusinessException("Employee not found", "EMPLOYEE_NOT_FOUND"));

        if (!passwordEncoder.matches(request.getPin(), employee.getPin())) {
            throw new BusinessException("Invalid PIN", "INVALID_PIN");
        }

        // Verify device assignment
        AmbulanceDevice device = deviceRepository.findByDeviceId(request.getDeviceId())
                .orElseThrow(() -> new BusinessException("Device not found", "DEVICE_NOT_FOUND"));

        boolean isAssigned = assignmentRepository.existsByEmployeeAndDeviceAndActiveTrue(employee, device);
        if (!isAssigned) {
            throw new BusinessException("Employee not assigned to this device", "INVALID_DEVICE");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("employeeId", employee.getEmployeeId());
        claims.put("role", employee.getRole());
        claims.put("deviceId", device.getDeviceId());

        String token = jwtUtil.generateToken(employee.getEmployeeId(), claims);

        return EmployeeResponse.builder()
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .role(employee.getRole())
                .token(token)
                .build();
    }
}