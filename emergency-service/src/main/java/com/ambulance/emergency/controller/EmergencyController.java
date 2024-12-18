package com.ambulance.emergency.controller;

import com.ambulance.common.dto.BaseResponse;
import com.ambulance.emergency.dto.CreateEmergencyRequest;
import com.ambulance.emergency.dto.EmergencyResponse;
import com.ambulance.emergency.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/emergencies")
@RequiredArgsConstructor
public class EmergencyController {
    private final EmergencyService emergencyService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<BaseResponse<EmergencyResponse>> createEmergency(@Valid @RequestBody CreateEmergencyRequest request) {
        EmergencyResponse response = emergencyService.createEmergency(request);
        return ResponseEntity.ok(BaseResponse.success(response));
    }
}