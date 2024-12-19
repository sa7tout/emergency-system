package com.ambulance.common.repository;

import com.ambulance.common.entity.DeviceAssignmentEntity;
import com.ambulance.common.entity.Employee;
import com.ambulance.common.entity.Ambulance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeviceAssignmentRepository extends JpaRepository<DeviceAssignmentEntity, Long> {
    @Query(value = "SELECT ad.device_id FROM ambulance_devices ad " +
            "INNER JOIN device_assignments da ON da.device_id = ad.id " +
            "INNER JOIN employees e ON e.id = da.employee_id " +
            "WHERE e.employee_id = :employeeId AND da.active = true",
            nativeQuery = true)
    String findActiveDeviceIdByEmployeeId(@Param("employeeId") String employeeId);

    @Query(value = "SELECT EXISTS (SELECT 1 FROM ambulances a " +
            "INNER JOIN ambulance_devices ad ON ad.device_id = a.device_id " +
            "WHERE ad.device_id = :deviceId AND a.id = :ambulanceId)",
            nativeQuery = true)
    boolean isDeviceAssignedToAmbulance(@Param("deviceId") String deviceId, @Param("ambulanceId") Long ambulanceId);

    @Query("SELECT e FROM DeviceAssignmentEntity da " +
            "JOIN da.employee e " +
            "JOIN da.device d " +
            "JOIN Ambulance a ON a.deviceId = d.deviceId " +
            "WHERE a.id = :ambulanceId AND da.active = true")
    Optional<Employee> findDriverByAmbulanceId(@Param("ambulanceId") Long ambulanceId);

    @Query(value = "SELECT * FROM device_assignments WHERE device_id = :deviceId AND active = true",
            nativeQuery = true)
    Optional<DeviceAssignmentEntity> findByDeviceIdAndActiveTrue(@Param("deviceId") Long deviceId);
}