CREATE TABLE emergency_cases (
    id BIGSERIAL PRIMARY KEY,
    pickup_latitude DOUBLE PRECISION NOT NULL,
    pickup_longitude DOUBLE PRECISION NOT NULL,
    patient_name VARCHAR(100) NOT NULL,
    contact_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL,
    assigned_ambulance_id BIGINT,
    assigned_hospital_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);