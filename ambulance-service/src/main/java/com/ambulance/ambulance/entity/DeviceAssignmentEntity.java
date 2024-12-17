package com.ambulance.ambulance.entity;

import com.ambulance.common.entity.Employee;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;


@Data
@Entity
@Table(name = "device_assignments")
public class DeviceAssignmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "device_id", nullable = false)
    private DeviceEntity device;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDateTime assignedAt;

    @Column(name = "active")
    private Boolean active = true;
}