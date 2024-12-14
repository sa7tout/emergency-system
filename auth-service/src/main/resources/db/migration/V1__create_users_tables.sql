CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (username, password, email)
VALUES ('admin', '$2a$10$cLb.DONc/5QqZI1S9JjNku62eqG5SXqwOP7Caf/M8cveeAlrYB7ey', 'admin@system.com');

CREATE TABLE user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    PRIMARY KEY (user_id, role)
);

INSERT INTO user_roles (user_id, role)
VALUES ((SELECT id FROM users WHERE username = 'admin'), 'ADMIN');
