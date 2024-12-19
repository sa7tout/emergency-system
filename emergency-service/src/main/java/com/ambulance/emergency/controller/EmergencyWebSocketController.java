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

    public void sendEmergencyUpdate(EmergencyNotification notification) {
        log.debug("Sending emergency notification: {}", notification);
        webSocketHandler.sendEmergencyUpdate(notification);
    }
}
