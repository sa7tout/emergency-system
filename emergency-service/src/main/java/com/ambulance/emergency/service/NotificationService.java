package com.ambulance.emergency.service;

import com.ambulance.common.dto.EmergencyNotification;
import com.ambulance.common.dto.Location;
import com.ambulance.emergency.config.EmergencyWebSocketHandler;
import com.ambulance.emergency.entity.EmergencyCase;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final KafkaTemplate<String, EmergencyNotification> kafkaTemplate;
    private final EmergencyWebSocketHandler webSocketHandler;

    public void notifyEmergency(EmergencyCase emergency) {
        EmergencyNotification notification = createNotification(emergency);
        kafkaTemplate.send("emergency-alerts", notification);
        webSocketHandler.sendEmergencyUpdate(notification);
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