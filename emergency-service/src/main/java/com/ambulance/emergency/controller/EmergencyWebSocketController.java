package com.ambulance.emergency.controller;

import com.ambulance.common.dto.EmergencyNotification;
import com.ambulance.emergency.entity.EmergencyCase;
import com.ambulance.emergency.repository.EmergencyRepository;
import com.ambulance.emergency.config.EmergencyWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
@Slf4j
public class EmergencyWebSocketController {
    private final EmergencyWebSocketHandler webSocketHandler;
    private final EmergencyRepository emergencyRepository;

    public void sendEmergencyUpdate(EmergencyNotification notification) {
        log.debug("Sending notification to admin topic: {}", notification);
        webSocketHandler.sendEmergencyUpdate(notification); // Use the WebSocket handler

        EmergencyCase emergency = emergencyRepository.findById(notification.getEmergencyId())
                .orElse(null);

        if (emergency != null && emergency.getAssignedAmbulanceId() != null) {
            log.debug("Sending notification to driver topic: {}", notification);
            webSocketHandler.sendEmergencyUpdate(notification); // Use the handler for the driver as well
        }
    }
}
