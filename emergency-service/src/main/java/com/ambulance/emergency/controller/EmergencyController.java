package com.ambulance.emergency.controller;

import com.ambulance.common.dto.BaseResponse;
import com.ambulance.emergency.dto.CreateEmergencyRequest;
import com.ambulance.emergency.dto.EmergencyResponse;
import com.ambulance.emergency.dto.UpdateEmergencyRequest;
import com.ambulance.emergency.service.EmergencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<BaseResponse<List<EmergencyResponse>>> getAllEmergencies() {
        List<EmergencyResponse> emergencies = emergencyService.getAllEmergencies();
        return ResponseEntity.ok(BaseResponse.success(emergencies));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<EmergencyResponse>> updateEmergency(
            @PathVariable Long id,
            @RequestBody UpdateEmergencyRequest request
    ) {
        EmergencyResponse response = emergencyService.updateEmergency(id, request);
        return ResponseEntity.ok(BaseResponse.success(response));
    }
}