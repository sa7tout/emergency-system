CREATE TABLE hospitals (
   id BIGSERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   address TEXT NOT NULL,
   latitude DOUBLE PRECISION NOT NULL,
   longitude DOUBLE PRECISION NOT NULL,
   total_beds INTEGER NOT NULL,
   available_beds INTEGER NOT NULL,
   emergency_capacity INTEGER NOT NULL,
   current_emergency_load INTEGER NOT NULL DEFAULT 0,
   is_active BOOLEAN NOT NULL DEFAULT true,
   specialties TEXT,
   contact_number VARCHAR(50) NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);