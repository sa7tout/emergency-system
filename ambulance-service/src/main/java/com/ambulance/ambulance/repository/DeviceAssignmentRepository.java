package com.ambulance.ambulance.repository;

import com.ambulance.ambulance.entity.DeviceAssignmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceAssignmentRepository extends JpaRepository<DeviceAssignmentEntity, Long> {
    Optional<DeviceAssignmentEntity> findByDeviceIdAndActiveTrue(Long deviceId);
}