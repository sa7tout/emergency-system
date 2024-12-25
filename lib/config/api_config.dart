class ApiConfig {
  static const String baseUrl = 'http://192.168.137.240:8091/emergency/api/v1';
  static String get authEndpoint => '$baseUrl/auth/employee/login';
}

class ApiConfigEmergency {
  static const String baseUrl = 'ws://192.168.137.240:8093/emergency/api/v1';
  static String get authEndpoint => '$baseUrl/ws/emergencies';
}
