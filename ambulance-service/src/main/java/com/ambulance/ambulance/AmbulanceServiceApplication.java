package com.ambulance.ambulance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.ambulance")
@EntityScan(basePackages = {"com.ambulance.common.entity", "com.ambulance.ambulance.entity"})
@EnableJpaRepositories(basePackages = {"com.ambulance.ambulance.repository", "com.ambulance.common.repository"})
public class AmbulanceServiceApplication {

    public static void main(String[] args) {
        SpringApplication.run(AmbulanceServiceApplication.class, args);
    }
}