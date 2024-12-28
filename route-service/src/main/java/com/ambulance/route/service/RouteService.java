package com.ambulance.route.service;

import com.ambulance.route.dto.RouteApiResponse;
import com.ambulance.route.entity.Route;
import com.ambulance.common.exception.BusinessException;
import com.ambulance.route.dto.RouteRequest;
import com.ambulance.route.dto.RouteResponse;
import com.ambulance.route.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;

    @Value("${routing.api.url}")
    private String routingApiUrl; // OSRM or GraphHopper API URL

    @Transactional
    public RouteResponse createRoute(RouteRequest request) {
        Route route = new Route();
        route.setEmergencyId(request.getEmergencyId());
        route.setAmbulanceId(request.getAmbulanceId());
        route.setStartLatitude(request.getStartLatitude());
        route.setStartLongitude(request.getStartLongitude());
        route.setEndLatitude(request.getEndLatitude());
        route.setEndLongitude(request.getEndLongitude());
        route.setCreatedAt(LocalDateTime.now());
        route.setUpdatedAt(LocalDateTime.now());
        route.setStatus("CREATED");

        // Fetch routing details
        try {
            RouteApiResponse routingResponse = getOptimizedRoute(
                    request.getStartLatitude(),
                    request.getStartLongitude(),
                    request.getEndLatitude(),
                    request.getEndLongitude()
            );
            route.setEstimatedDuration(routingResponse.getDuration());
            route.setEncodedPath(routingResponse.getEncodedPath());
        } catch (Exception e) {
            throw new BusinessException("Routing service failed", "ROUTING_SERVICE_ERROR");
        }

        return mapToResponse(routeRepository.save(route));
    }

    private RouteApiResponse getOptimizedRoute(double startLat, double startLng, double endLat, double endLng) {
        String url = String.format(
                "%s/route/v1/driving/%f,%f;%f,%f?overview=full&geometries=polyline&annotations=duration",
                routingApiUrl, startLng, startLat, endLng, endLat
        );

        RestTemplate restTemplate = new RestTemplate();
        Map<String, Object> response = restTemplate.getForObject(url, Map.class);

        if (response == null || !response.containsKey("routes")) {
            throw new BusinessException("Invalid response from routing service", "INVALID_ROUTING_RESPONSE");
        }

        Map<String, Object> firstRoute = ((List<Map<String, Object>>) response.get("routes")).get(0);
        double duration = (double) firstRoute.get("duration") / 60; // Convert seconds to minutes
        String encodedPath = (String) firstRoute.get("geometry");

        return new RouteApiResponse(duration, encodedPath);
    }

    @Transactional(readOnly = true)
    public RouteResponse getRoute(Long id) {
        return mapToResponse(findRoute(id));
    }

    @Transactional
    public RouteResponse updateActualDuration(Long id, double actualDuration) {
        Route route = findRoute(id);
        route.setActualDuration(actualDuration);
        route.setUpdatedAt(LocalDateTime.now());
        route.setStatus("COMPLETED");
        return mapToResponse(routeRepository.save(route));
    }

    @Transactional(readOnly = true)
    public List<RouteResponse> getRoutesByAmbulance(Long ambulanceId) {
        return routeRepository.findByAmbulanceId(ambulanceId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Route findRoute(Long id) {
        return routeRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Route not found", "ROUTE_NOT_FOUND"));
    }

    private RouteResponse mapToResponse(Route route) {
        RouteResponse response = new RouteResponse();
        response.setId(route.getId());
        response.setEmergencyId(route.getEmergencyId());
        response.setAmbulanceId(route.getAmbulanceId());
        response.setStartLatitude(route.getStartLatitude());
        response.setStartLongitude(route.getStartLongitude());
        response.setEndLatitude(route.getEndLatitude());
        response.setEndLongitude(route.getEndLongitude());
        response.setEstimatedDuration(route.getEstimatedDuration());
        response.setActualDuration(route.getActualDuration());
        response.setEncodedPath(route.getEncodedPath());
        response.setCreatedAt(route.getCreatedAt());
        response.setUpdatedAt(route.getUpdatedAt());
        response.setStatus(route.getStatus());
        return response;
    }
}
