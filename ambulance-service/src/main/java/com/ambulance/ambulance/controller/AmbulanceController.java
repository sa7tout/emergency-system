package com.ambulance.ambulance.controller;

import com.ambulance.ambulance.dto.*;
import com.ambulance.ambulance.service.AmbulanceService;
import com.ambulance.common.dto.BaseResponse;
import com.ambulance.common.dto.Location;
import com.ambulance.common.entity.Employee;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/ambulances")
@RequiredArgsConstructor
public class AmbulanceController {
    private final AmbulanceService ambulanceService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
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
    @PreAuthorize("hasAuthority('ADMIN')")
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

    @PostMapping("/devices")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<DeviceResponse>> registerDevice(
            @RequestBody DeviceRegistrationRequest request) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.registerDevice(request)));
    }

    @GetMapping("/devices")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<List<DeviceResponse>>> getAllDevices() {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.getAllDevices()));
    }

    @GetMapping("/devices/{id}")
    public ResponseEntity<BaseResponse<DeviceResponse>> getDevice(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.getDevice(id)));
    }

    @PatchMapping("/devices/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<DeviceResponse>> updateDeviceStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.updateDeviceStatus(id, status)));
    }

    @PostMapping("/devices/{id}/ping")
    public ResponseEntity<BaseResponse<DeviceResponse>> updateDevicePing(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.updateDevicePing(id)));
    }

    @DeleteMapping("/devices/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<Void>> deactivateDevice(@PathVariable Long id) {
        ambulanceService.deactivateDevice(id);
        return ResponseEntity.ok(BaseResponse.success(null));
    }
    @GetMapping("/drivers")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<List<Employee>>> getAvailableDrivers() {
        List<Employee> drivers = ambulanceService.getAvailableDrivers();
        return ResponseEntity.ok(BaseResponse.success(drivers));
    }
    @PostMapping("/devices/assignments")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<DeviceAssignmentResponse>> assignDeviceToDriver(
            @RequestBody DeviceAssignmentRequest request) {
        return ResponseEntity.ok(BaseResponse.success(ambulanceService.assignDeviceToEmployee(request)));
    }
}