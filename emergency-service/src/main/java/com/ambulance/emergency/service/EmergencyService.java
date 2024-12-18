package com.ambulance.emergency.service;

import com.ambulance.common.enums.EmergencyStatus;
import com.ambulance.emergency.dto.CreateEmergencyRequest;
import com.ambulance.emergency.dto.EmergencyResponse;
import com.ambulance.emergency.entity.EmergencyCase;
import com.ambulance.common.exception.BusinessException;
import com.ambulance.emergency.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmergencyService {
    private final EmergencyRepository emergencyRepository;
    private final NotificationService notificationService;

    @Transactional
    public EmergencyResponse createEmergency(CreateEmergencyRequest request) {
        validateRequest(request);

        try {
            EmergencyCase emergency = new EmergencyCase();
            emergency.setPickupLatitude(request.getPickupLatitude());
            emergency.setPickupLongitude(request.getPickupLongitude());
            emergency.setPatientName(request.getPatientName());
            emergency.setContactNumber(request.getContactNumber());
            emergency.setStatus(EmergencyStatus.PENDING);
            emergency.setCreatedAt(LocalDateTime.now());
            emergency.setUpdatedAt(LocalDateTime.now());

            emergency = emergencyRepository.save(emergency);
            log.info("Created new emergency case with ID: {}", emergency.getId());

            EmergencyResponse response = mapToResponse(emergency);
            notificationService.notifyEmergency(emergency);

            return response;
        } catch (DataIntegrityViolationException e) {
            log.error("Failed to create emergency case: {}", e.getMessage());
            throw new BusinessException("Failed to save emergency case. Please ensure all required fields are provided.", "EMERGENCY_CREATE_FAILED");
        }
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasAnyRole('ADMIN', 'DRIVER')")
    public EmergencyResponse getEmergencyById(Long id) {
        EmergencyCase emergency = findEmergencyById(id);
        return mapToResponse(emergency);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('ADMIN')")
    public Page<EmergencyResponse> getAllEmergencies(Pageable pageable) {
        return emergencyRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    @PreAuthorize("hasRole('DRIVER')")
    public List<EmergencyResponse> getEmergenciesForAmbulance(Long ambulanceId) {
        if (ambulanceId == null) {
            throw new BusinessException("Ambulance ID cannot be null", "INVALID_AMBULANCE_ID");
        }
        return emergencyRepository.findByAssignedAmbulanceId(ambulanceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public EmergencyCase findEmergencyById(Long id) {
        if (id == null) {
            throw new BusinessException("Emergency ID cannot be null", "INVALID_EMERGENCY_ID");
        }
        return emergencyRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Emergency case not found with ID: " + id, "EMERGENCY_NOT_FOUND"));
    }

    private void validateRequest(CreateEmergencyRequest request) {
        if (request == null) {
            throw new BusinessException("Request cannot be null", "INVALID_REQUEST");
        }

        if (request.getPickupLatitude() == null) {
            throw new BusinessException("Pickup latitude is required", "MISSING_LATITUDE");
        }

        if (request.getPickupLongitude() == null) {
            throw new BusinessException("Pickup longitude is required", "MISSING_LONGITUDE");
        }

        if (request.getPatientName() == null || request.getPatientName().trim().isEmpty()) {
            throw new BusinessException("Patient name is required", "MISSING_PATIENT_NAME");
        }

        if (request.getContactNumber() == null || request.getContactNumber().trim().isEmpty()) {
            throw new BusinessException("Contact number is required", "MISSING_CONTACT_NUMBER");
        }

        // Validate latitude range
        if (request.getPickupLatitude() < -90 || request.getPickupLatitude() > 90) {
            throw new BusinessException("Latitude must be between -90 and 90 degrees", "INVALID_LATITUDE");
        }

        // Validate longitude range
        if (request.getPickupLongitude() < -180 || request.getPickupLongitude() > 180) {
            throw new BusinessException("Longitude must be between -180 and 180 degrees", "INVALID_LONGITUDE");
        }

        // Validate phone number format
        if (!request.getContactNumber().matches("^\\+?[1-9]\\d{1,14}$")) {
            throw new BusinessException("Invalid phone number format", "INVALID_PHONE_NUMBER");
        }
    }

    private EmergencyResponse mapToResponse(EmergencyCase emergency) {
        if (emergency == null) {
            throw new BusinessException("Emergency case cannot be null", "NULL_EMERGENCY");
        }

        EmergencyResponse response = new EmergencyResponse();
        response.setId(emergency.getId());
        response.setPickupLatitude(emergency.getPickupLatitude());
        response.setPickupLongitude(emergency.getPickupLongitude());
        response.setPatientName(emergency.getPatientName());
        response.setContactNumber(emergency.getContactNumber());
        response.setStatus(emergency.getStatus());
        response.setAssignedAmbulanceId(emergency.getAssignedAmbulanceId());
        response.setAssignedHospitalId(emergency.getAssignedHospitalId());
        response.setCreatedAt(emergency.getCreatedAt());
        response.setUpdatedAt(emergency.getUpdatedAt());
        return response;
    }
}