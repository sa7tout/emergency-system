CREATE TABLE routes (
    id BIGSERIAL PRIMARY KEY,
    emergency_id BIGINT NOT NULL,
    ambulance_id BIGINT NOT NULL,
    start_latitude DOUBLE PRECISION NOT NULL,
    start_longitude DOUBLE PRECISION NOT NULL,
    end_latitude DOUBLE PRECISION NOT NULL,
    end_longitude DOUBLE PRECISION NOT NULL,
    estimated_duration DOUBLE PRECISION,
    actual_duration DOUBLE PRECISION,
    encoded_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'CREATED',
    CONSTRAINT uk_emergency_ambulance UNIQUE (emergency_id, ambulance_id)
);