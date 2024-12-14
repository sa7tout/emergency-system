package com.ambulance.emergency.service;

import com.ambulance.common.dto.Hospital;
import com.ambulance.common.dto.Location;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
@RequiredArgsConstructor
public class HospitalFinderService {
    private final RestTemplate restTemplate;

    public Hospital findNearestHospital(Location patientLocation) {
        String url = "http://hospital-service/api/v1/hospitals/nearest";
        ResponseEntity<Hospital> response = restTemplate.postForEntity(
                url,
                patientLocation,
                Hospital.class
        );
        return response.getBody();
    }
}