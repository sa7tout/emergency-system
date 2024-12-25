import 'package:ambulance_tracker/config/api_config.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class AuthService {
  static Future<AuthResponse> login({
    required String employeeId,
    required String pin,
    required String deviceId,
  }) async {
    try {
      final response = await http.post(
        Uri.parse(ApiConfig.authEndpoint),
        headers: {
          'Content-Type': 'application/json',
        },
        body: jsonEncode({
          'employeeId': employeeId,
          'pin': pin,
          'deviceId': deviceId,
        }),
      );

      print('Statut de la réponse: ${response.statusCode}');
      print('Corps de la réponse: ${response.body}');

      // Parser la réponse JSON indépendamment du code de statut
      final jsonResponse = jsonDecode(response.body);
      final authResponse = AuthResponse.fromJson(jsonResponse);

      // Si le statut est 200 ou 400, on laisse l'AuthResponse décider
      return authResponse;
    } catch (e) {
      print('Erreur de connexion: $e');
      return AuthResponse(
          success: false, message: 'Erreur de connexion: $e', data: null);
    }
  }
}

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
