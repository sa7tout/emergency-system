import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:flutter/material.dart';
import 'package:ambulance_tracker/model/emergencu_model.dart';
import 'package:ambulance_tracker/screenes/map.dart';
import 'dart:convert';
import 'dart:typed_data';

class NotificationService {
  static final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  // Navigation key for handling notifications
  static final GlobalKey<NavigatorState> navigatorKey =
      GlobalKey<NavigatorState>();

  // Initialize notification settings
  static Future<void> initialize() async {
    // Android initialization with custom icon
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    // iOS initialization
    const DarwinInitializationSettings initializationSettingsIOS =
        DarwinInitializationSettings(
      requestSoundPermission: true,
      requestBadgePermission: true,
      requestAlertPermission: true,
    );

    const InitializationSettings initializationSettings =
        InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsIOS,
    );

    await flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse:
          (NotificationResponse notificationResponse) {
        // Parse the payload to get emergency details
        if (notificationResponse.payload != null) {
          try {
            // Convert payload string to Emergency object
            final emergency =
                _parseEmergencyFromPayload(notificationResponse.payload!);

            // Navigate to MapScreen with the emergency
            if (navigatorKey.currentState != null && emergency != null) {
              navigatorKey.currentState!.push(
                MaterialPageRoute(
                  builder: (context) => MapScreen(emergency: emergency),
                ),
              );
            }
          } catch (e) {
            print('Error parsing emergency from notification: $e');
          }
        }
      },
    );
  }

  // Show emergency notification
  static Future<void> showEmergencyNotification({
    required Emergency emergency,
  }) async {
    // Serialize emergency to payload
    final payload = _createEmergencyPayload(emergency);

    // Android notification details with ambulance-specific styling
    AndroidNotificationDetails androidNotificationDetails =
        AndroidNotificationDetails(
      'emergency_channel',
      'Emergency Notifications',
      channelDescription: 'Notifications for emergency alerts',
      importance: Importance.high,
      priority: Priority.max,
      color: Color(0xFFE63946), // Ambulance red
      styleInformation: BigTextStyleInformation(
        'Patient: ${emergency.patientDetails}\nLocation: ${emergency.patientLocation.latitude}, ${emergency.patientLocation.longitude}',
        contentTitle: 'URGENT EMERGENCY ALERT',
        htmlFormatContentTitle: true,
        summaryText: 'Ambulance Response Required',
      ),
      ticker: 'Emergency Alert',
      ongoing: true, // Makes notification persistent
      enableVibration: true,
      vibrationPattern:
          Int64List.fromList([0, 500, 250, 500]), // Vibration pattern
    );

    // iOS notification details
    DarwinNotificationDetails iOSNotificationDetails =
        DarwinNotificationDetails(
      presentSound: true,
      presentBadge: true,
      presentAlert: true,
    );

    NotificationDetails notificationDetails = NotificationDetails(
      android: androidNotificationDetails,
      iOS: iOSNotificationDetails,
    );

    await flutterLocalNotificationsPlugin.show(
      emergency.emergencyId,
      'EMERGENCY ALERT',
      'Patient: ${emergency.patientDetails}',
      notificationDetails,
      payload: payload,
    );
  }

  // Helper method to convert Emergency to payload string
  static String _createEmergencyPayload(Emergency emergency) {
    return jsonEncode({
      'emergencyId': emergency.emergencyId,
      'patientLocation': {
        'latitude': emergency.patientLocation.latitude,
        'longitude': emergency.patientLocation.longitude,
      },
      'patientDetails': emergency.patientDetails,
      'nearestHospital': emergency.nearestHospital,
      'assignedAmbulanceId': emergency.assignedAmbulanceId,
      'assignedDriverName': emergency.assignedDriverName,
    });
  }

  // Helper method to parse Emergency from payload string
  static Emergency? _parseEmergencyFromPayload(String payload) {
    try {
      final Map<String, dynamic> jsonMap = jsonDecode(payload);
      return Emergency.fromJson(jsonMap);
    } catch (e) {
      print('Error parsing emergency payload: $e');
      return null;
    }
  }
}
