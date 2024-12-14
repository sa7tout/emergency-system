package com.ambulance.auth.repository;

import com.ambulance.auth.entity.AmbulanceDevice;
import com.ambulance.auth.entity.DeviceAssignment;
import com.ambulance.auth.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DeviceAssignmentRepository extends JpaRepository<DeviceAssignment, Long> {
    boolean existsByEmployeeAndDeviceAndActiveTrue(Employee employee, AmbulanceDevice device);
}