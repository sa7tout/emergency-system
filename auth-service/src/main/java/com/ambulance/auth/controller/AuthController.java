package com.ambulance.auth.controller;

import com.ambulance.auth.dto.*;
import com.ambulance.auth.service.AuthService;
import com.ambulance.auth.service.EmployeeAuthService;
import com.ambulance.common.dto.BaseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final EmployeeAuthService employeeAuthService;

    /*@PostMapping("/admin/register")
    public ResponseEntity<BaseResponse<AuthResponse>> registerAdmin(@Valid @RequestBody UserRegistrationRequest request) {
        return ResponseEntity.ok(BaseResponse.success(authService.registerAdmin(request)));
    }*/

    @PostMapping("/admin/login")
    public ResponseEntity<BaseResponse<AuthResponse>> adminLogin(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(BaseResponse.success(authService.loginAdmin(request)));
    }

    @PostMapping("/employee/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<EmployeeResponse>> registerEmployee(
            @Valid @RequestBody EmployeeRegistrationRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(BaseResponse.success(
                authService.registerEmployee(request, authentication.getName())
        ));
    }

    @PostMapping("/employee/login")
    public ResponseEntity<BaseResponse<EmployeeResponse>> employeeLogin(
            @Valid @RequestBody EmployeeAuthRequest request) {
        return ResponseEntity.ok(BaseResponse.success(
                employeeAuthService.authenticateEmployee(request)
        ));
    }
}