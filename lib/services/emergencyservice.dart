import 'dart:convert';
import 'dart:async';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/io.dart';
import 'package:ambulance_tracker/config/api_config.dart';
import 'package:ambulance_tracker/model/emergencu_model.dart';
import 'package:ambulance_tracker/services/notification_service.dart';

class EmergencyService {
  WebSocketChannel? _channel;
  final void Function(Emergency) onEmergencyReceived;
  final String token;
  bool _isConnected = false;
  Timer? _reconnectTimer;
  int _reconnectAttempts = 0;
  static const int _maxReconnectAttempts = 5;
  static const Duration _reconnectDelay = Duration(seconds: 5);

  EmergencyService({
    required this.token,
    required this.onEmergencyReceived,
  });

  void connect() {
    // Prevent multiple connection attempts
    if (_isConnected || _channel != null) {
      print('Already connected to WebSocket');
      return;
    }

    try {
      final wsUrl = '${ApiConfigEmergency.baseUrl}/ws/emergencies?token=$token';
      print('Connecting to WebSocket: $wsUrl');

      // Use IOWebSocketChannel.connect
      _channel = IOWebSocketChannel.connect(
        Uri.parse(wsUrl),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      _isConnected = true;
      _reconnectAttempts = 0;

      _channel?.stream.listen(
        (message) {
          print('Received WebSocket message: $message');
          try {
            final data = jsonDecode(message);
            final emergency = Emergency.fromJson(data);

            // Call the original callback
            onEmergencyReceived(emergency);

            // Show local notification
            NotificationService.showEmergencyNotification(
              emergency: emergency,
            );
          } catch (e) {
            print('Error processing WebSocket message: $e');
          }
        },
        onDone: () {
          print('WebSocket connection closed');
          _handleDisconnection();
        },
        onError: (error) {
          print('WebSocket error: $error');
          _handleDisconnection();
        },
        cancelOnError: false,
      );

      print('WebSocket connection established');
    } catch (e) {
      print('Initial WebSocket connection error: $e');
      _handleDisconnection();
    }
  }

  void _handleDisconnection() {
    // Mark as disconnected
    _isConnected = false;

    // Cancel existing timer if any
    _reconnectTimer?.cancel();

    // Attempt reconnection if max attempts not reached
    if (_reconnectAttempts < _maxReconnectAttempts) {
      _reconnectAttempts++;
      _reconnectTimer = Timer(_reconnectDelay, () {
        print('Attempting to reconnect (Attempt $_reconnectAttempts)');
        connect();
      });
    } else {
      print('Max reconnection attempts reached. Manual reconnection required.');
    }
  }

  // Manually trigger reconnection
  void reconnect() {
    // Reset reconnect attempts
    _reconnectAttempts = 0;

    // Dispose of existing connection
    dispose();

    // Attempt new connection
    connect();
  }

  // Check current connection status
  bool get isConnected => _isConnected;

  // Cleanup method
  void dispose() {
    // Cancel reconnect timer if active
    _reconnectTimer?.cancel();

    // Close WebSocket channel if exists
    if (_channel != null) {
      print('Disposing EmergencyService');
      _channel?.sink.close();
      _channel = null;
    }

    // Reset connection state
    _isConnected = false;
    _reconnectAttempts = 0;
  }
}
