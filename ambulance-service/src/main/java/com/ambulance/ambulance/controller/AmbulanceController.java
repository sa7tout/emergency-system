package com.ambulance.ambulance.controller;

import com.ambulance.ambulance.dto.*;
import com.ambulance.ambulance.service.AmbulanceService;
import com.ambulance.common.dto.BaseResponse;
import com.ambulance.common.dto.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/ambulances")
@RequiredArgsConstructor
public class AmbulanceController {
    private final AmbulanceService ambulanceService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<AmbulanceResponse>> registerAmbulance(
            @RequestBody AmbulanceRegistrationRequest request) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.registerAmbulance(request)));
    }

    @GetMapping
    public ResponseEntity<BaseResponse<List<AmbulanceResponse>>> getAllAmbulances() {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.getAllAmbulances()));
    }

    @GetMapping("/active")
    public ResponseEntity<BaseResponse<List<AmbulanceResponse>>> getActiveAmbulances() {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.getActiveAmbulances()));
    }

    @PostMapping("/{id}/location")
    public ResponseEntity<BaseResponse<Void>> updateLocation(
            @PathVariable Long id,
            @RequestBody Location location) {
        ambulanceService.updateLocation(id, location);
        return ResponseEntity.ok(BaseResponse.success(null));
    }

    @GetMapping("/{id}/location")
    public ResponseEntity<BaseResponse<Location>> getLocation(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.getLocation(id)));
    }

    @PatchMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BaseResponse<AmbulanceResponse>> updateAmbulance(
            @PathVariable Long id,
            @RequestBody AmbulanceUpdateRequest request) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.updateAmbulance(id, request)));
    }

    @GetMapping("/{id}/history")
    public ResponseEntity<BaseResponse<List<Location>>> getLocationHistory(
            @PathVariable Long id,
            @RequestParam LocalDateTime startTime,
            @RequestParam LocalDateTime endTime) {
        return ResponseEntity.ok(BaseResponse.success(
                ambulanceService.getLocationHistory(id, startTime, endTime)));
    }
}