package com.ambulance.ambulance.repository;

import com.ambulance.ambulance.entity.AmbulanceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AmbulanceRepository extends JpaRepository<AmbulanceEntity, Long> {
    boolean existsByVehicleNumber(String vehicleNumber);
    List<AmbulanceEntity> findByActiveTrue();
}