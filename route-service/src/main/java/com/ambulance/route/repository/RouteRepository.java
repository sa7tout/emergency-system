// RouteRepository.java
package com.ambulance.route.repository;

import com.ambulance.route.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByEmergencyIdAndAmbulanceId(Long emergencyId, Long ambulanceId);
    List<Route> findByAmbulanceId(Long ambulanceId);
    List<Route> findByEmergencyId(Long emergencyId);
}