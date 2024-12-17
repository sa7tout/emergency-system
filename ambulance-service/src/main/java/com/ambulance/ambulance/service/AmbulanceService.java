package com.ambulance.ambulance.service;

import com.ambulance.ambulance.dto.*;
import com.ambulance.ambulance.entity.AmbulanceEntity;
import com.ambulance.ambulance.entity.DeviceAssignmentEntity;
import com.ambulance.ambulance.entity.DeviceEntity;
import com.ambulance.ambulance.repository.AmbulanceRepository;
import com.ambulance.ambulance.repository.DeviceAssignmentRepository;
import com.ambulance.ambulance.repository.DeviceRepository;
import com.ambulance.common.dto.Location;
import com.ambulance.common.entity.Employee;
import com.ambulance.common.enums.AmbulanceStatus;
import com.ambulance.common.exception.BusinessException;
import com.ambulance.common.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.influxdb.InfluxDB;
import org.influxdb.InfluxDBFactory;
import org.influxdb.dto.Point;
import org.influxdb.dto.Query;
import org.influxdb.dto.QueryResult;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmbulanceService {
    private final AmbulanceRepository ambulanceRepository;
    private final DeviceRepository deviceRepository;
    private final EmployeeRepository employeeRepository;
    private final DeviceAssignmentRepository deviceAssignmentRepository;
    private final InfluxDB influxDB;

    @Transactional
    public AmbulanceResponse registerAmbulance(AmbulanceRegistrationRequest request) {
        if (ambulanceRepository.existsByVehicleNumber(request.getVehicleNumber())) {
            throw new BusinessException("Vehicle number already exists", "DUPLICATE_VEHICLE");
        }

        AmbulanceEntity ambulance = new AmbulanceEntity();
        ambulance.setVehicleNumber(request.getVehicleNumber());
        ambulance.setModel(request.getModel());
        ambulance.setYear(request.getYear());
        ambulance.setEquipmentDetails(request.getEquipmentDetails());
        ambulance.setDeviceId(request.getDeviceId());
        ambulance.setStatus(AmbulanceStatus.AVAILABLE);
        ambulance.setActive(true);
        ambulance.setLastUpdated(LocalDateTime.now());

        return mapToResponse(ambulanceRepository.save(ambulance));
    }

    @Transactional(readOnly = true)
    public List<AmbulanceResponse> getAllAmbulances() {
        return ambulanceRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AmbulanceResponse> getActiveAmbulances() {
        return ambulanceRepository.findByActiveTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void updateLocation(Long id, Location location) {
        AmbulanceEntity ambulance = getAmbulanceEntity(id);

        // Update in PostgreSQL
        ambulance.setCurrentLatitude(location.getLatitude());
        ambulance.setCurrentLongitude(location.getLongitude());
        ambulance.setLastUpdated(LocalDateTime.now());
        ambulanceRepository.save(ambulance);

        // Store in InfluxDB for history
        Point point = Point.measurement("ambulance_locations")
                .time(System.currentTimeMillis(), TimeUnit.MILLISECONDS)
                .tag("ambulance_id", id.toString())
                .tag("vehicle_number", ambulance.getVehicleNumber())
                .addField("latitude", location.getLatitude())
                .addField("longitude", location.getLongitude())
                .build();

        influxDB.write(point);
    }

    @Transactional(readOnly = true)
    public Location getLocation(Long id) {
        AmbulanceEntity ambulance = getAmbulanceEntity(id);
        Location location = new Location();
        location.setLatitude(ambulance.getCurrentLatitude());
        location.setLongitude(ambulance.getCurrentLongitude());
        return location;
    }

    @Transactional
    public AmbulanceResponse updateAmbulance(Long id, AmbulanceUpdateRequest request) {
        AmbulanceEntity ambulance = getAmbulanceEntity(id);

        if (request.getStatus() != null) {
            ambulance.setStatus(request.getStatus());
        }
        if (request.getCurrentAssignment() != null) {
            ambulance.setCurrentAssignment(request.getCurrentAssignment());
        }
        if (request.getActive() != null) {
            ambulance.setActive(request.getActive());
        }

        return mapToResponse(ambulanceRepository.save(ambulance));
    }

    public List<Location> getLocationHistory(Long id, LocalDateTime startTime, LocalDateTime endTime) {
        // Query InfluxDB for location history
        String query = String.format(
                "SELECT latitude, longitude FROM ambulance_locations WHERE ambulance_id = '%s' AND time >= '%s' AND time <= '%s'",
                id, startTime, endTime
        );

        QueryResult queryResult = influxDB.query(new Query(query));

        return queryResult.getResults().get(0).getSeries().get(0).getValues().stream()
                .map(value -> {
                    Location location = new Location();
                    location.setLatitude((Double) value.get(1));
                    location.setLongitude((Double) value.get(2));
                    return location;
                })
                .collect(Collectors.toList());
    }

    private AmbulanceEntity getAmbulanceEntity(Long id) {
        return ambulanceRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Ambulance not found", "NOT_FOUND"));
    }

    private AmbulanceResponse mapToResponse(AmbulanceEntity ambulance) {
        AmbulanceResponse response = new AmbulanceResponse();
        response.setId(ambulance.getId());
        response.setVehicleNumber(ambulance.getVehicleNumber());
        response.setStatus(ambulance.getStatus());
        response.setCurrentLatitude(ambulance.getCurrentLatitude());
        response.setCurrentLongitude(ambulance.getCurrentLongitude());
        response.setSpeed(ambulance.getSpeed());
        response.setActive(ambulance.getActive());
        response.setCurrentAssignment(ambulance.getCurrentAssignment());
        response.setLastUpdated(ambulance.getLastUpdated());
        return response;
    }

    @Transactional
    public DeviceResponse registerDevice(DeviceRegistrationRequest request) {
        if (deviceRepository.existsByDeviceId(request.getDeviceId())) {
            throw new BusinessException("Device ID already exists", "DUPLICATE_DEVICE");
        }

        DeviceEntity device = new DeviceEntity();
        device.setDeviceId(request.getDeviceId());
        device.setAmbulanceUnit(request.getAmbulanceUnit());
        device.setStatus(request.getStatus());

        return mapToDeviceResponse(deviceRepository.save(device));
    }

    @Transactional(readOnly = true)
    public List<DeviceResponse> getAllDevices() {
        return deviceRepository.findAll().stream()
                .map(this::mapToDeviceResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DeviceResponse getDevice(Long id) {
        return mapToDeviceResponse(getDeviceEntity(id));
    }

    @Transactional
    public DeviceResponse updateDeviceStatus(Long id, String status) {
        DeviceEntity device = getDeviceEntity(id);
        device.setStatus(status);
        return mapToDeviceResponse(deviceRepository.save(device));
    }

    @Transactional
    public DeviceResponse updateDevicePing(Long id) {
        DeviceEntity device = getDeviceEntity(id);
        device.setLastPing(LocalDateTime.now());
        return mapToDeviceResponse(deviceRepository.save(device));
    }

    @Transactional
    public void deactivateDevice(Long id) {
        DeviceEntity device = getDeviceEntity(id);
        device.setStatus("INACTIVE");
        deviceRepository.save(device);
    }

    private DeviceEntity getDeviceEntity(Long id) {
        return deviceRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Device not found", "NOT_FOUND"));
    }

    private DeviceResponse mapToDeviceResponse(DeviceEntity device) {
        DeviceResponse response = new DeviceResponse();
        response.setId(device.getId());
        response.setDeviceId(device.getDeviceId());
        response.setAmbulanceUnit(device.getAmbulanceUnit());
        response.setStatus(device.getStatus());
        response.setRegisteredAt(device.getRegisteredAt());
        response.setLastPing(device.getLastPing());
        return response;
    }

    @Transactional
    public DeviceAssignmentResponse assignDeviceToEmployee(DeviceAssignmentRequest request) {
        // Check if device exists
        DeviceEntity device = deviceRepository.findById(request.getDeviceId())
                .orElseThrow(() -> new BusinessException("Device not found", "DEVICE_NOT_FOUND"));

        // Check if employee exists and is a driver
        Employee employee = employeeRepository.findById(request.getEmployeeId())
                .orElseThrow(() -> new BusinessException("Employee not found", "EMPLOYEE_NOT_FOUND"));

        if (!"DRIVER".equals(employee.getRole())) {
            throw new BusinessException("Only drivers can be assigned devices", "INVALID_EMPLOYEE_ROLE");
        }

        // Find existing active assignment for this device
        DeviceAssignmentEntity existingAssignment =
                deviceAssignmentRepository.findByDeviceIdAndActiveTrue(request.getDeviceId())
                        .orElse(new DeviceAssignmentEntity());

        // Update existing assignment or create new one
        existingAssignment.setDevice(device);
        existingAssignment.setEmployee(employee);
        existingAssignment.setAssignedAt(LocalDateTime.now());
        existingAssignment.setActive(true);

        DeviceAssignmentEntity savedAssignment = deviceAssignmentRepository.save(existingAssignment);

        // Update device status
        device.setStatus("ASSIGNED");
        deviceRepository.save(device);

        return mapToDeviceAssignmentResponse(savedAssignment);
    }

    private DeviceAssignmentResponse mapToDeviceAssignmentResponse(DeviceAssignmentEntity assignment) {
        DeviceAssignmentResponse response = new DeviceAssignmentResponse();
        response.setId(assignment.getId());
        response.setDeviceId(assignment.getDevice().getId());
        response.setEmployeeId(assignment.getEmployee().getId());
        response.setEmployeeName(assignment.getEmployee().getFullName());
        response.setDeviceStatus(assignment.getDevice().getStatus());
        response.setAssignedAt(assignment.getAssignedAt());
        return response;
    }

    @Transactional(readOnly = true)
    public List<DeviceAssignmentResponse> getAllDeviceAssignments() {
        return deviceAssignmentRepository.findAll().stream()
                .map(this::mapToDeviceAssignmentResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deactivateDeviceAssignment(Long id) {
        DeviceAssignmentEntity assignment = deviceAssignmentRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Assignment not found", "ASSIGNMENT_NOT_FOUND"));

        // Deactivate the assignment
        assignment.setActive(false);
        deviceAssignmentRepository.save(assignment);

        // Update device status back to active
        DeviceEntity device = assignment.getDevice();
        device.setStatus("ACTIVE");
        deviceRepository.save(device);
    }
}