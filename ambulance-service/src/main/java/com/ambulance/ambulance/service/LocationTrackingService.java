package com.ambulance.ambulance.service;

import com.ambulance.ambulance.entity.AmbulanceEntity;
import com.ambulance.ambulance.repository.AmbulanceRepository;
import com.ambulance.common.dto.Location;
import com.ambulance.common.exception.BusinessException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class LocationTrackingService {
    private final SimpMessagingTemplate webSocket;
    private final AmbulanceRepository ambulanceRepository;

    @Transactional
    public void updateLocation(Long ambulanceId, Location location) {
        AmbulanceEntity ambulance = ambulanceRepository.findById(ambulanceId)
                .orElseThrow(() -> new BusinessException("Ambulance not found", "NOT_FOUND"));

        ambulance.setCurrentLatitude(location.getLatitude());
        ambulance.setCurrentLongitude(location.getLongitude());
        ambulance.setLastUpdated(LocalDateTime.now());

        ambulanceRepository.save(ambulance);
        webSocket.convertAndSend("/topic/ambulances/" + ambulanceId, location);
    }
}