package com.ambulance.emergency.service;

import com.ambulance.common.dto.EmergencyNotification;
import com.ambulance.emergency.entity.EmergencyCase;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import com.ambulance.common.dto.Location;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final KafkaTemplate<String, EmergencyNotification> kafkaTemplate;
    private final SimpMessagingTemplate webSocket;

    public void notifyEmergency(EmergencyCase emergency) {
        EmergencyNotification notification = createNotification(emergency);
        kafkaTemplate.send("emergency-alerts", notification);
        webSocket.convertAndSend("/topic/emergencies", notification);
    }

    private EmergencyNotification createNotification(EmergencyCase emergency) {
        Location patientLocation = new Location();
        patientLocation.setLatitude(emergency.getPickupLatitude());
        patientLocation.setLongitude(emergency.getPickupLongitude());

        return EmergencyNotification.builder()
                .emergencyId(emergency.getId())
                .patientLocation(patientLocation)
                .patientDetails(emergency.getPatientName())
                .build();
    }
}