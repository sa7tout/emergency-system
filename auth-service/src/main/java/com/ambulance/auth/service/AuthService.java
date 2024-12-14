package com.ambulance.auth.service;

import com.ambulance.auth.dto.*;
import com.ambulance.auth.entity.Employee;
import com.ambulance.auth.entity.User;
import com.ambulance.auth.repository.EmployeeRepository;
import com.ambulance.auth.repository.UserRepository;
import com.ambulance.common.exception.BusinessException;
import com.ambulance.common.security.config.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    /*public AuthResponse registerAdmin(UserRegistrationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BusinessException("Username already exists", "USERNAME_EXISTS");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail()); // Add this line to set the email
        user.setRoles(Set.of("ROLE_ADMIN"));
        user = userRepository.save(user);

        String token = jwtUtil.generateToken(user.getUsername(), Map.of("roles", user.getRoles()));

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .roles(user.getRoles())
                .build();
    }*/

    // Admin Authentication
    public AuthResponse loginAdmin(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new BusinessException("User not found", "USER_NOT_FOUND"));

        String token = jwtUtil.generateToken(user.getUsername(), Map.of("roles", user.getRoles()));

        return AuthResponse.builder()
                .token(token)
                .username(user.getUsername())
                .roles(user.getRoles())
                .build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public EmployeeResponse registerEmployee(EmployeeRegistrationRequest request, String adminUsername) {
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new BusinessException("Admin not found", "ADMIN_NOT_FOUND"));

        if(employeeRepository.existsByEmployeeId(request.getEmployeeId())) {
            throw new BusinessException("Employee ID already exists", "EMPLOYEE_EXISTS");
        }

        Employee employee = new Employee();
        employee.setEmployeeId(request.getEmployeeId());
        employee.setPin(passwordEncoder.encode(request.getPin()));
        employee.setFullName(request.getFullName());
        employee.setRole(request.getRole());
        employee.setCreatedBy(admin);

        employee = employeeRepository.save(employee);

        return mapToEmployeeResponse(employee);
    }

    private EmployeeResponse mapToEmployeeResponse(Employee employee) {
        return EmployeeResponse.builder()
                .employeeId(employee.getEmployeeId())
                .fullName(employee.getFullName())
                .role(employee.getRole())
                .build();
    }
}