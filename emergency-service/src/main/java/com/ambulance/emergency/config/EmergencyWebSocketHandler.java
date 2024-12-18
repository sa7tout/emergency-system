package com.ambulance.emergency.config;

import com.ambulance.common.dto.EmergencyNotification;
import com.ambulance.common.repository.DeviceAssignmentRepository;
import com.ambulance.emergency.entity.EmergencyCase;
import com.ambulance.emergency.repository.EmergencyRepository;
import com.ambulance.common.security.config.JwtUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.Collection;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Component
@Slf4j
@RequiredArgsConstructor
public class EmergencyWebSocketHandler extends TextWebSocketHandler {

    private final Map<WebSocketSession, UserSessionInfo> sessionMap = new ConcurrentHashMap<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final EmergencyRepository emergencyRepository;
    private final DeviceAssignmentRepository deviceAssignmentRepository;
    private final JwtUtil jwtUtil;

    @Data
    @AllArgsConstructor
    private static class UserSessionInfo {
        private String username;
        private String employeeId;
        private Set<String> roles;
        private String deviceId;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        try {
            String token = extractToken(session);
            if (token == null || !jwtUtil.validateToken(token)) {
                log.warn("Invalid or missing JWT token in WebSocket connection");
                closeSession(session);
                return;
            }

            String username = jwtUtil.extractUsername(token);
            Collection<? extends GrantedAuthority> authorities = jwtUtil.extractAuthorities(token);
            Set<String> roles = authorities.stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toSet());

            // Only allow ADMIN and DRIVER roles
            if (!roles.contains("ADMIN") && !roles.contains("DRIVER")) {
                log.warn("Unauthorized role attempting to connect: {}", roles);
                closeSession(session);
                return;
            }

            String employeeId = null;
            String deviceId = null;

            if (roles.contains("DRIVER")) {
                employeeId = jwtUtil.extractClaim(token, claims -> claims.get("employeeId", String.class));
                if (employeeId == null) {
                    log.warn("Driver without employeeId attempting to connect");
                    closeSession(session);
                    return;
                }

                deviceId = deviceAssignmentRepository.findActiveDeviceIdByEmployeeId(employeeId);
                if (deviceId == null) {
                    log.warn("Driver {} has no active device assignment", employeeId);
                    closeSession(session);
                    return;
                }
            }

            sessionMap.put(session, new UserSessionInfo(username, employeeId, roles, deviceId));
            log.debug("WebSocket connection established for user {} with roles {}. Employee ID: {}. Device ID: {}. Total sessions: {}",
                    username, roles, employeeId, deviceId, sessionMap.size());

        } catch (Exception e) {
            log.error("Error establishing WebSocket connection: {}", e.getMessage());
            closeSession(session);
        }
    }

    public void sendEmergencyUpdate(EmergencyNotification notification) {
        EmergencyCase emergency = emergencyRepository.findById(notification.getEmergencyId())
                .orElse(null);
        if (emergency == null) {
            log.error("Emergency not found with ID: {}", notification.getEmergencyId());
            return;
        }

        TextMessage message;
        try {
            message = new TextMessage(objectMapper.writeValueAsString(notification));
            log.debug("Preparing to send WebSocket message for emergency {}", notification.getEmergencyId());
            int messagesSent = 0;

            for (Map.Entry<WebSocketSession, UserSessionInfo> entry : sessionMap.entrySet()) {
                WebSocketSession session = entry.getKey();
                UserSessionInfo userInfo = entry.getValue();

                if (!session.isOpen()) continue;

                boolean shouldSendMessage = false;

                // Send to admins
                if (userInfo.getRoles().contains("ADMIN")) {
                    shouldSendMessage = true;
                }
                // Send to assigned driver
                else if (userInfo.getRoles().contains("DRIVER") &&
                        emergency.getAssignedAmbulanceId() != null &&
                        isDriverAssignedToAmbulance(userInfo.getDeviceId(), emergency.getAssignedAmbulanceId())) {
                    shouldSendMessage = true;
                }

                if (shouldSendMessage) {
                    sendMessageToSession(session, message);
                    messagesSent++;
                }
            }

            log.debug("Emergency update sent to {} recipients", messagesSent);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize notification: {}", e.getMessage());
        }
    }

    private void sendMessageToSession(WebSocketSession session, TextMessage message) {
        try {
            session.sendMessage(message);
            log.debug("Message sent successfully to session: {}", session.getId());
        } catch (IOException e) {
            log.error("Failed to send message to session {}: {}", session.getId(), e.getMessage());
            closeSession(session);
        }
    }

    private void closeSession(WebSocketSession session) {
        try {
            session.close();
        } catch (IOException e) {
            log.error("Error closing WebSocket session: {}", e.getMessage());
        } finally {
            sessionMap.remove(session);
        }
    }

    private String extractToken(WebSocketSession session) {
        String token = session.getHandshakeHeaders().getFirst("Authorization");
        if (token != null && token.startsWith("Bearer ")) {
            return token.substring(7);
        }
        return null;
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        UserSessionInfo userInfo = sessionMap.remove(session);
        if (userInfo != null) {
            log.debug("WebSocket connection closed for user {}. Remaining sessions: {}",
                    userInfo.getUsername(), sessionMap.size());
        }
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) {
        log.error("Transport error occurred for session {}: {}", session.getId(), exception.getMessage());
        closeSession(session);
    }

    private boolean isDriverAssignedToAmbulance(String deviceId, Long ambulanceId) {
        return deviceAssignmentRepository.isDeviceAssignedToAmbulance(deviceId, ambulanceId);
    }
}