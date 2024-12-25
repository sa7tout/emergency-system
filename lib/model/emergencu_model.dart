class Emergency {
  final int emergencyId;
  final PatientLocation patientLocation;
  final String patientDetails;
  final String? nearestHospital;
  final int assignedAmbulanceId;
  final String assignedDriverName;

  Emergency({
    required this.emergencyId,
    required this.patientLocation,
    required this.patientDetails,
    this.nearestHospital,
    required this.assignedAmbulanceId,
    required this.assignedDriverName,
  });

  factory Emergency.fromJson(Map<String, dynamic> json) {
    return Emergency(
      emergencyId: json['emergencyId'],
      patientLocation: PatientLocation.fromJson(json['patientLocation']),
      patientDetails: json['patientDetails'],
      nearestHospital: json['nearestHospital'],
      assignedAmbulanceId: json['assignedAmbulanceId'],
      assignedDriverName: json['assignedDriverName'],
    );
  }

  // Add toJson method
  Map<String, dynamic> toJson() {
    return {
      'emergencyId': emergencyId,
      'patientLocation': patientLocation.toJson(),
      'patientDetails': patientDetails,
      'nearestHospital': nearestHospital,
      'assignedAmbulanceId': assignedAmbulanceId,
      'assignedDriverName': assignedDriverName,
    };
  }
}

class PatientLocation {
  final double latitude;
  final double longitude;

  PatientLocation({
    required this.latitude,
    required this.longitude,
  });

  factory PatientLocation.fromJson(Map<String, dynamic> json) {
    return PatientLocation(
      latitude: json['latitude'],
      longitude: json['longitude'],
    );
  }

  // Add toJson method
  Map<String, dynamic> toJson() {
    return {
      'latitude': latitude,
      'longitude': longitude,
    };
  }
}
