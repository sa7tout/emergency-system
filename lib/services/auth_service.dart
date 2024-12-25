import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ambulance_tracker/config/api_config.dart';
import 'package:ambulance_tracker/model/auth_model.dart';

import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  static const String TOKEN_KEY = 'auth_token';
  static const String EMPLOYEE_ID_KEY = 'employee_id';
  static const String DEVICE_ID_KEY = 'device_id';

  static Future<void> _saveAuthData(AuthData data, String deviceId) async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.setString(TOKEN_KEY, data.token);
    await prefs.setString(EMPLOYEE_ID_KEY, data.employeeId);
    await prefs.setString(DEVICE_ID_KEY, deviceId);
  }

  static Future<String?> getToken() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString(TOKEN_KEY);
  }

  static Future<void> clearAuthData() async {
    final SharedPreferences prefs = await SharedPreferences.getInstance();
    await prefs.clear();
  }

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

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');

      final jsonResponse = jsonDecode(response.body);
      final authResponse = AuthResponse.fromJson(jsonResponse);

      if (authResponse.success && authResponse.data != null) {
        await _saveAuthData(authResponse.data!, deviceId);
      }

      return authResponse;
    } catch (e) {
      print('Login error: $e');
      return AuthResponse(
        success: false,
        message: 'Connection error: $e',
        data: null,
      );
    }
  }

  static Future<bool> isLoggedIn() async {
    final token = await getToken();
    return token != null && token.isNotEmpty;
  }

  static Future<void> logout() async {
    await clearAuthData();
  }
}
