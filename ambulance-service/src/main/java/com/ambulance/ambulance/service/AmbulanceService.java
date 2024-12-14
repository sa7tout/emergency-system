package com.ambulance.ambulance.service;

import com.ambulance.ambulance.dto.*;
import com.ambulance.ambulance.entity.AmbulanceEntity;
import com.ambulance.ambulance.repository.AmbulanceRepository;
import com.ambulance.common.dto.Location;
import com.ambulance.common.enums.AmbulanceStatus;
import com.ambulance.common.exception.BusinessException;
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
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AmbulanceService {
    private final AmbulanceRepository ambulanceRepository;
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
}