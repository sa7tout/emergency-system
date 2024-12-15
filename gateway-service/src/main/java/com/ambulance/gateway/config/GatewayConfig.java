package com.ambulance.gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springdoc.core.models.GroupedOpenApi;

@Configuration
public class GatewayConfig {
    @Bean
    public GroupedOpenApi authApi() {
        return GroupedOpenApi.builder()
                .group("auth")
                .pathsToMatch("/emergency/api/v1/auth/**")
                .build();
    }

    @Bean
    public GroupedOpenApi ambulanceApi() {
        return GroupedOpenApi.builder()
                .group("ambulance")
                .pathsToMatch("/emergency/api/v1/ambulance/**")
                .build();
    }

    @Bean
    public GroupedOpenApi emergencyApi() {
        return GroupedOpenApi.builder()
                .group("emergency")
                .pathsToMatch("/emergency/api/v1/emergency-case/**")
                .build();
    }

    @Bean
    public GroupedOpenApi hospitalApi() {
        return GroupedOpenApi.builder()
                .group("hospital")
                .pathsToMatch("/emergency/api/v1/hospital/**")
                .build();
    }

    @Bean
    public GroupedOpenApi routeApi() {
        return GroupedOpenApi.builder()
                .group("route")
                .pathsToMatch("/emergency/api/v1/route/**")
                .build();
    }

    @Bean
    public RouteLocator routeLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("auth-swagger", r -> r.path("/emergency/api/v1/auth/swagger-ui/**", "/emergency/api/v1/auth/api-docs/**")
                        .uri("http://auth-service:8091"))
                .route("ambulance-swagger", r -> r.path("/emergency/api/v1/ambulance/swagger-ui/**", "/emergency/api/v1/ambulance/api-docs/**")
                        .uri("http://ambulance-service:8092"))
                .route("emergency-swagger", r -> r.path("/emergency/api/v1/emergency-case/swagger-ui/**", "/emergency/api/v1/emergency-case/api-docs/**")
                        .uri("http://emergency-service:8093"))
                .route("hospital-swagger", r -> r.path("/emergency/api/v1/hospital/swagger-ui/**", "/emergency/api/v1/hospital/api-docs/**")
                        .uri("http://hospital-service:8094"))
                .route("route-swagger", r -> r.path("/emergency/api/v1/route/swagger-ui/**", "/emergency/api/v1/route/api-docs/**")
                        .uri("http://route-service:8095"))
                .route("auth-service", r -> r.path("/emergency/api/v1/auth/**")
                        .uri("http://auth-service:8091"))
                .route("ambulance-service", r -> r.path("/emergency/api/v1/ambulances/**")
                        .uri("http://ambulance-service:8092"))
                .route("emergency-service", r -> r.path("/emergency/api/v1/emergencies/**")
                        .uri("http://emergency-service:8093"))
                .route("hospital-service", r -> r.path("/emergency/api/v1/hospitals/**")
                        .uri("http://hospital-service:8094"))
                .route("route-service", r -> r.path("/emergency/api/v1/routes/**")
                        .uri("http://route-service:8095"))
                .build();
    }
}