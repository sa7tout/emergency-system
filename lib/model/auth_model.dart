class AuthResponse {
  final bool success;
  final String message;
  final AuthData? data;

  AuthResponse({
    required this.success,
    required this.message,
    this.data,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      data: json['data'] != null ? AuthData.fromJson(json['data']) : null,
    );
  }
}

class AuthData {
  final String employeeId;
  final String fullName;
  final String role;
  final String token;
  final List<String> assignedDevices;

  AuthData({
    required this.employeeId,
    required this.fullName,
    required this.role,
    required this.token,
    required this.assignedDevices,
  });

  factory AuthData.fromJson(Map<String, dynamic> json) {
    return AuthData(
      employeeId: json['employeeId'] ?? '',
      fullName: json['fullName'] ?? '',
      role: json['role'] ?? '',
      token: json['token'] ?? '',
      assignedDevices: List<String>.from(json['assignedDevices'] ?? []),
    );
  }
}
