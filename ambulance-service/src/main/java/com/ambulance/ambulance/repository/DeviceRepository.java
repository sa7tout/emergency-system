package com.ambulance.ambulance.repository;

import com.ambulance.ambulance.entity.DeviceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<DeviceEntity, Long> {
    boolean existsByDeviceId(String deviceId);
    DeviceEntity findByDeviceId(String deviceId);
}