package com.ambulance.route.controller;

import com.ambulance.common.dto.BaseResponse;
import com.ambulance.route.dto.RouteRequest;
import com.ambulance.route.dto.RouteResponse;
import com.ambulance.route.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {
    private final RouteService routeService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER')")
    public ResponseEntity<BaseResponse<RouteResponse>> createRoute(@Valid @RequestBody RouteRequest request) {
        return ResponseEntity.ok(BaseResponse.success(routeService.createRoute(request)));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER', 'DRIVER')")
    public ResponseEntity<BaseResponse<RouteResponse>> getRoute(@PathVariable Long id) {
        return ResponseEntity.ok(BaseResponse.success(routeService.getRoute(id)));
    }

    @GetMapping("/ambulance/{ambulanceId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'DISPATCHER', 'DRIVER')")
    public ResponseEntity<BaseResponse<List<RouteResponse>>> getRoutesByAmbulance(@PathVariable Long ambulanceId) {
        return ResponseEntity.ok(BaseResponse.success(routeService.getRoutesByAmbulance(ambulanceId)));
    }
}