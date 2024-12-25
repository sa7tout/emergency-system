# SmartEmergency: Emergency Response System

SmartEmergency is a comprehensive microservices-based system designed to optimize emergency response operations through real-time ambulance tracking and intelligent route optimization. The system integrates multiple services to provide efficient emergency resource management, hospital coordination, and real-time location tracking.

## 🚀 Features

- Real-time GPS tracking of ambulances
- Intelligent route optimization considering traffic conditions
- Hospital capacity management and coordination
- Real-time communication via WebSocket and Kafka
- Secure authentication and authorization
- Mobile application for ambulance drivers
- Administrative dashboard for emergency management

## 🏗️ Architecture

The system is built on a microservices architecture consisting of six core services:

- **API Gateway (Port 8090)**: Routes requests and handles authentication
- **Auth Service (Port 8091)**: Manages user authentication and authorization
- **Ambulance Service (Port 8092)**: Handles ambulance tracking and management
- **Emergency Service (Port 8093)**: Coordinates emergency cases and responses
- **Hospital Service (Port 8094)**: Manages hospital information and capacity
- **Route Service (Port 8095)**: Optimizes emergency response routes

## 🛠️ Technologies Used

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Cloud Gateway
- PostgreSQL
- InfluxDB
- Apache Kafka

### Frontend
- Angular for admin dashboard
- Flutter for mobile application
- WebSocket for real-time updates
- Material Design components

### DevOps
- Docker and Docker Compose
- Maven for build automation
- Flyway for database migrations

## 📋 Prerequisites

Before running the application, ensure you have the following installed:
- Java Development Kit (JDK) 17
- Docker and Docker Compose
- Node.js and npm
- Flutter SDK
- Maven

## 🚀 Getting Started

### Clone the Repository

```bash
git clone https://github.com/yourusername/smart-emergency.git
cd smart-emergency
```

### Configure Environment Variables

Create a `.env` file in the root directory:

```env
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin911
POSTGRES_DB=emergency_db
JWT_SECRET=your_jwt_secret_key
```

### Start the Services

Using Docker Compose:

```bash
docker-compose up -d
```

This will start all required services:
- PostgreSQL database
- Apache Kafka and Zookeeper
- All microservices
- PgAdmin for database management

### Access the Applications

- Admin Dashboard: http://localhost:4200
- API Gateway: http://localhost:8090
- API Documentation: http://localhost:8090/emergency/swagger-ui.html
- PgAdmin: http://localhost:8080

## 📂 Project Structure

```
smart-emergency/
├── ambulance-service/     # Ambulance tracking and management
├── auth-service/          # Authentication and authorization
├── common/               # Shared utilities and models
├── emergency-service/    # Emergency case management
├── gateway-service/      # API Gateway configuration
├── hospital-service/     # Hospital management
├── route-service/        # Route optimization
├── frontend/            # Angular admin dashboard
├── mobile/              # Flutter mobile application
├── docker-compose.yml   # Docker composition
└── pom.xml             # Parent Maven configuration
```

## 🔒 Security

The system implements comprehensive security measures:
- JWT-based authentication
- Role-based access control
- Device-level authentication for ambulances
- Secure WebSocket connections
- API Gateway security filters

## 📱 Mobile Application Features

The Flutter-based mobile app for ambulance drivers provides:
- Real-time emergency notifications
- Turn-by-turn navigation
- Patient information display
- Status updates
- Hospital availability information

## 💻 Admin Dashboard Features

The Angular-based administrative dashboard offers:
- Emergency case management
- Real-time ambulance tracking
- Hospital capacity monitoring
- Route optimization controls
- Comprehensive reporting

## 🧪 Testing

Run the tests using Maven:

```bash
mvn clean test
```

The project includes:
- Unit tests
- Integration tests
- End-to-end tests
- Performance tests

## 📚 API Documentation

Swagger documentation is available at:
- Gateway: http://localhost:8090/emergency/swagger-ui.html
- Individual service documentation is available at their respective ports

## 👥 Authors

- KASSIDE YOUNESS
- ARBEL HIBA
- ELMGHARI AYA
