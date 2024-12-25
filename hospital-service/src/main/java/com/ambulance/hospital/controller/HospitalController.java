package com.ambulance.hospital.controller;

import com.ambulance.common.dto.BaseResponse;
import com.ambulance.hospital.dto.HospitalRequest;
import com.ambulance.hospital.dto.HospitalResponse;
import com.ambulance.hospital.service.HospitalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/hospitals")
@RequiredArgsConstructor
public class HospitalController {
    private final HospitalService hospitalService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<HospitalResponse>> createHospital(
            @Valid @RequestBody HospitalRequest request) {
        return ResponseEntity.ok(BaseResponse.success(hospitalService.createHospital(request)));
    }

    @PutMapping("/{id}/capacity")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'HOSPITAL_STAFF')")
    public ResponseEntity<BaseResponse<HospitalResponse>> updateCapacity(
            @PathVariable Long id,
            @RequestParam Integer availableBeds,
            @RequestParam Integer currentLoad) {
        return ResponseEntity.ok(BaseResponse.success(
                hospitalService.updateBedCapacity(id, availableBeds, currentLoad)));
    }

    @GetMapping("/available")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<BaseResponse<List<HospitalResponse>>> getAvailableHospitals() {
        return ResponseEntity.ok(BaseResponse.success(hospitalService.getAvailableHospitals()));
    }
}