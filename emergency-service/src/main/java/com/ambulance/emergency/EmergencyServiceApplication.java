package com.ambulance.emergency;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = "com.ambulance")
@EntityScan("com.ambulance.emergency.entity")
@EnableJpaRepositories("com.ambulance.emergency.repository")
public class EmergencyServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(EmergencyServiceApplication.class, args);
    }
}