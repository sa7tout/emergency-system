package com.ambulance.auth.repository;

import com.ambulance.auth.entity.AmbulanceDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DeviceRepository extends JpaRepository<AmbulanceDevice, Long> {
    Optional<AmbulanceDevice> findByDeviceId(String deviceId);
    boolean existsByDeviceId(String deviceId);
}