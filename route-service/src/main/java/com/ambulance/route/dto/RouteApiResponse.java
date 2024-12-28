package com.ambulance.route.dto;

public class RouteApiResponse {
    private double duration; // Duration in minutes
    private String encodedPath;

    public RouteApiResponse(double duration, String encodedPath) {
        this.duration = duration;
        this.encodedPath = encodedPath;
    }

    public double getDuration() {
        return duration;
    }

    public String getEncodedPath() {
        return encodedPath;
    }
}
