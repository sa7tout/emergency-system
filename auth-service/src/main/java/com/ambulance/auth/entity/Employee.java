package com.ambulance.auth.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "employees")
public class Employee {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String employeeId;

    @Column(nullable = false)
    private String pin;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role;  // DRIVER, PARAMEDIC, etc.

    @Column(length = 20)
    private String status = "ACTIVE";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;  // Admin who created this employee

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "employee")
    private List<DeviceAssignment> deviceAssignments;
}