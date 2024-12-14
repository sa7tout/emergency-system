package com.ambulance.hospital.service;

import com.ambulance.common.exception.BusinessException;
import com.ambulance.hospital.dto.HospitalRequest;
import com.ambulance.hospital.dto.HospitalResponse;
import com.ambulance.hospital.entity.Hospital;
import com.ambulance.hospital.repository.HospitalRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HospitalService {
    private final HospitalRepository hospitalRepository;

    @Transactional
    public HospitalResponse createHospital(HospitalRequest request) {
        Hospital hospital = new Hospital();
        hospital.setName(request.getName());
        hospital.setAddress(request.getAddress());
        hospital.setLatitude(request.getLatitude());
        hospital.setLongitude(request.getLongitude());
        hospital.setTotalBeds(request.getTotalBeds());
        hospital.setAvailableBeds(request.getTotalBeds());
        hospital.setEmergencyCapacity(request.getEmergencyCapacity());
        hospital.setCurrentEmergencyLoad(0);
        hospital.setIsActive(true);
        hospital.setSpecialties(request.getSpecialties());
        hospital.setContactNumber(request.getContactNumber());

        return mapToResponse(hospitalRepository.save(hospital));
    }

    @Transactional
    public HospitalResponse updateBedCapacity(Long id, Integer availableBeds, Integer currentLoad) {
        Hospital hospital = findHospital(id);
        hospital.setAvailableBeds(availableBeds);
        hospital.setCurrentEmergencyLoad(currentLoad);
        return mapToResponse(hospitalRepository.save(hospital));
    }

    @Transactional(readOnly = true)
    public List<HospitalResponse> getAvailableHospitals() {
        return hospitalRepository.findByIsActiveTrueAndAvailableBedsGreaterThan(0).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Hospital findHospital(Long id) {
        return hospitalRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Hospital not found", "HOSPITAL_NOT_FOUND"));
    }

    private HospitalResponse mapToResponse(Hospital hospital) {
        HospitalResponse response = new HospitalResponse();
        response.setId(hospital.getId());
        response.setName(hospital.getName());
        response.setAddress(hospital.getAddress());
        response.setLatitude(hospital.getLatitude());
        response.setLongitude(hospital.getLongitude());
        response.setTotalBeds(hospital.getTotalBeds());
        response.setAvailableBeds(hospital.getAvailableBeds());
        response.setEmergencyCapacity(hospital.getEmergencyCapacity());
        response.setCurrentEmergencyLoad(hospital.getCurrentEmergencyLoad());
        response.setIsActive(hospital.getIsActive());
        response.setSpecialties(hospital.getSpecialties());
        response.setContactNumber(hospital.getContactNumber());
        return response;
    }
}