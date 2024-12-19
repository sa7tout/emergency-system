package com.ambulance.emergency.service;

import com.ambulance.common.dto.EmergencyNotification;
import com.ambulance.common.dto.Location;
import com.ambulance.common.repository.DeviceAssignmentRepository;
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
    private final DeviceAssignmentRepository deviceAssignmentRepository;

    public void notifyEmergency(EmergencyCase emergency) {
        EmergencyNotification notification = createNotification(emergency);
        kafkaTemplate.send("emergency-alerts", notification);
        webSocketHandler.sendEmergencyUpdate(notification);
    }

    private EmergencyNotification createNotification(EmergencyCase emergency) {
        Location patientLocation = new Location();
        patientLocation.setLatitude(emergency.getPickupLatitude());
        patientLocation.setLongitude(emergency.getPickupLongitude());

        String assignedDriverName = null;
        if (emergency.getAssignedAmbulanceId() != null) {
            assignedDriverName = deviceAssignmentRepository.findDriverByAmbulanceId(emergency.getAssignedAmbulanceId())
                    .map(employee -> employee.getFullName())
                    .orElse(null);
        }

        return EmergencyNotification.builder()
                .emergencyId(emergency.getId())
                .patientLocation(patientLocation)
                .patientDetails(emergency.getPatientName())
                .assignedAmbulanceId(emergency.getAssignedAmbulanceId())
                .assignedDriverName(assignedDriverName)
                .build();
    }
}