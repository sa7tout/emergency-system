package com.ambulance.route.service;

import com.ambulance.common.exception.BusinessException;
import com.ambulance.route.dto.RouteRequest;
import com.ambulance.route.dto.RouteResponse;
import com.ambulance.route.entity.Route;
import com.ambulance.route.repository.RouteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RouteService {
    private final RouteRepository routeRepository;

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
        route.setStatus("CREATED");

        // TODO: Call external routing service to get path and duration
        route.setEstimatedDuration(0.0);
        route.setEncodedPath("");

        return mapToResponse(routeRepository.save(route));
    }

    @Transactional(readOnly = true)
    public RouteResponse getRoute(Long id) {
        return mapToResponse(findRoute(id));
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
        response.setEncodedPath(route.getEncodedPath());
        response.setCreatedAt(route.getCreatedAt());
        response.setStatus(route.getStatus());
        return response;
    }
}