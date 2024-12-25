import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';

// Import necessary models and services
import 'package:ambulance_tracker/model/emergencu_model.dart';
import 'package:ambulance_tracker/services/emergencyservice.dart';
import 'package:ambulance_tracker/screenes/map.dart';

class PageAlert extends StatefulWidget {
  final String token;

  const PageAlert({Key? key, required this.token}) : super(key: key);

  @override
  _PageAlertState createState() => _PageAlertState();
}

class _PageAlertState extends State<PageAlert> {
  // Emergency service and state management variables
  late EmergencyService _emergencyService;
  List<Emergency> emergencies = [];
  bool isConnecting = true;
  String? connectionError;

  // Key for storing emergencies in local storage
  static const String _emergenciesKey = 'saved_emergencies';

  @override
  void initState() {
    super.initState();
    // Load saved emergencies and initialize emergency service
    _loadSavedEmergencies();
    _initializeEmergencyService();
  }

  // Load saved emergencies from local storage
  Future<void> _loadSavedEmergencies() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final emergencyJsonList = prefs.getStringList(_emergenciesKey) ?? [];

      setState(() {
        emergencies = emergencyJsonList.map((jsonString) {
          return Emergency.fromJson(json.decode(jsonString));
        }).toList();
      });
    } catch (e) {
      print('Error loading saved emergencies: $e');
    }
  }

  // Save emergencies to local storage
  Future<void> _saveEmergencies() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final emergencyJsonList = emergencies.map((emergency) {
        return json.encode(emergency.toJson());
      }).toList();

      await prefs.setStringList(_emergenciesKey, emergencyJsonList);
    } catch (e) {
      print('Error saving emergencies: $e');
    }
  }

  // Initialize emergency service connection
  Future<void> _initializeEmergencyService() async {
    try {
      setState(() {
        isConnecting = true;
        connectionError = null;
      });

      _emergencyService = EmergencyService(
        token: widget.token,
        onEmergencyReceived: _handleEmergency,
      );
      _emergencyService.connect();

      setState(() {
        isConnecting = false;
      });
    } catch (e) {
      setState(() {
        isConnecting = false;
        connectionError = 'Failed to connect to emergency service: $e';
      });
    }
  }

  // Handle incoming emergency
  void _handleEmergency(Emergency emergency) {
    if (mounted) {
      setState(() {
        // Check if this emergency already exists
        final existingIndex = emergencies
            .indexWhere((e) => e.emergencyId == emergency.emergencyId);

        if (existingIndex == -1) {
          // Add new emergency at the beginning of the list
          emergencies.insert(0, emergency);

          // Save to persistent storage
          _saveEmergencies();
        }
      });
      _showEmergencyNotification(emergency);
    }
  }

  // Show notification for new emergency
  void _showEmergencyNotification(Emergency emergency) {
    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.warning_amber_rounded, color: Colors.white),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'New Emergency Alert',
                      style: TextStyle(
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    Text(
                      'Patient: ${emergency.patientDetails}',
                      style: const TextStyle(fontSize: 12),
                    ),
                  ],
                ),
              ),
            ],
          ),
          backgroundColor: Colors.red,
          duration: const Duration(seconds: 5),
          action: SnackBarAction(
            label: 'VIEW',
            textColor: Colors.white,
            onPressed: () => _navigateToMap(emergency),
          ),
        ),
      );
    }
  }

  // Navigate to map screen for a specific emergency
  void _navigateToMap(Emergency emergency) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MapScreen(emergency: emergency),
      ),
    );
  }

  // Clear all saved emergencies
  Future<void> _clearEmergencies() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_emergenciesKey);
    setState(() {
      emergencies.clear();
    });
  }

  // Build emergency card widget
  Widget _buildEmergencyCard(Emergency emergency) {
    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: InkWell(
        onTap: () => _navigateToMap(emergency),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Emergency ID and Navigation Icon
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.red,
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'ID: ${emergency.emergencyId}',
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const Spacer(),
                  Icon(
                    Icons.navigation_rounded,
                    color: Theme.of(context).primaryColor,
                  ),
                ],
              ),
              const SizedBox(height: 12),

              // Patient Details
              Text(
                'Patient: ${emergency.patientDetails}',
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
              ),
              const SizedBox(height: 8),

              // Location Details
              Text(
                'Location: ${emergency.patientLocation.latitude.toStringAsFixed(4)}, ${emergency.patientLocation.longitude.toStringAsFixed(4)}',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              const SizedBox(height: 4),

              // Ambulance and Driver Information
              Text(
                'Ambulance ID: ${emergency.assignedAmbulanceId}',
                style: Theme.of(context).textTheme.bodyMedium,
              ),
              Text(
                'Driver: ${emergency.assignedDriverName}',
                style: Theme.of(context).textTheme.bodyMedium,
              ),

              // Optional Nearest Hospital
              if (emergency.nearestHospital != null) ...[
                const SizedBox(height: 4),
                Text(
                  'Hospital: ${emergency.nearestHospital}',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // App Bar with Clear and Refresh Actions
      appBar: AppBar(
        title: const Text('Emergency Alerts'),
        actions: [
          // Clear All Emergencies Button
          IconButton(
            icon: const Icon(Icons.clear_all),
            onPressed: _clearEmergencies,
            tooltip: 'Clear All Emergencies',
          ),
          // Refresh Emergency Service Connection
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: isConnecting ? null : _initializeEmergencyService,
          ),
        ],
      ),

      // Body with Different States
      body: isConnecting
          // Connecting State
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Connecting to emergency service...'),
                ],
              ),
            )
          // Connection Error State
          : connectionError != null
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Icon(
                        Icons.error_outline,
                        size: 48,
                        color: Colors.red,
                      ),
                      const SizedBox(height: 16),
                      Text(
                        connectionError!,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.red),
                      ),
                      const SizedBox(height: 16),
                      ElevatedButton(
                        onPressed: _initializeEmergencyService,
                        child: const Text('Try Again'),
                      ),
                    ],
                  ),
                )
              // No Emergencies State
              : emergencies.isEmpty
                  ? Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            Icons.notifications_none,
                            size: 64,
                            color: Colors.grey[400],
                          ),
                          const SizedBox(height: 16),
                          Text(
                            'No emergencies yet',
                            style: TextStyle(
                              fontSize: 18,
                              color: Colors.grey[600],
                            ),
                          ),
                        ],
                      ),
                    )
                  // Emergencies List State
                  : RefreshIndicator(
                      onRefresh: _initializeEmergencyService,
                      child: ListView.builder(
                        itemCount: emergencies.length,
                        itemBuilder: (context, index) =>
                            _buildEmergencyCard(emergencies[index]),
                      ),
                    ),
    );
  }

  // Cleanup emergency service on dispose
  @override
  void dispose() {
    _emergencyService.dispose();
    super.dispose();
  }
}
