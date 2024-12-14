package com.ambulance.emergency.repository;

import com.ambulance.emergency.entity.EmergencyCase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyRepository extends JpaRepository<EmergencyCase, Long> {
}