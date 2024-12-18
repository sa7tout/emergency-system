package com.ambulance.common.repository;

import com.ambulance.common.entity.DeviceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeviceRepository extends JpaRepository<DeviceEntity, Long> {
    boolean existsByDeviceId(String deviceId);
    DeviceEntity findByDeviceId(String deviceId);
}