import 'package:flutter/material.dart';
import 'package:ambulance_tracker/services/notification_service.dart';
import 'package:ambulance_tracker/screenes/Splashscreen.dart';

void main() async {
  // Ensure Flutter binding is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize notifications
  await NotificationService.initialize();

  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Ambulance Tracker',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
            seedColor: const Color.fromARGB(255, 162, 53, 53)),
        useMaterial3: true,
      ),
      // Set the navigator key to enable notification navigation
      navigatorKey: NotificationService.navigatorKey,
      home: const SplashScreen(),
    );
  }
}
