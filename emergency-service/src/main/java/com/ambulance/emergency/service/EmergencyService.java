package com.ambulance.emergency.service;

import com.ambulance.common.enums.EmergencyStatus;
import com.ambulance.common.exception.BusinessException;
import com.ambulance.emergency.dto.CreateEmergencyRequest;
import com.ambulance.emergency.dto.EmergencyResponse;
import com.ambulance.emergency.entity.EmergencyCase;
import com.ambulance.emergency.repository.EmergencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmergencyService {
    private final EmergencyRepository emergencyRepository;
    private final KafkaTemplate<String, EmergencyResponse> kafkaTemplate;

    public EmergencyResponse createEmergency(CreateEmergencyRequest request) {
        EmergencyCase emergency = new EmergencyCase();
        emergency.setPickupLatitude(request.getPickupLatitude());
        emergency.setPickupLongitude(request.getPickupLongitude());
        emergency.setPatientName(request.getPatientName());
        emergency.setContactNumber(request.getContactNumber());
        emergency.setStatus(EmergencyStatus.PENDING);
        emergency.setCreatedAt(LocalDateTime.now());
        emergency.setUpdatedAt(LocalDateTime.now());

        emergency = emergencyRepository.save(emergency);
        EmergencyResponse response = mapToResponse(emergency);

        // Notify about new emergency
        kafkaTemplate.send("emergency-events", response);

        return response;
    }

    private EmergencyResponse mapToResponse(EmergencyCase emergency) {
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