package com.ambulance.hospital.repository;

import com.ambulance.hospital.entity.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    List<Hospital> findByIsActiveTrue();
    List<Hospital> findByIsActiveTrueAndAvailableBedsGreaterThan(Integer minAvailableBeds);

    List<Hospital> findByNameContainingIgnoreCase(String name);
}