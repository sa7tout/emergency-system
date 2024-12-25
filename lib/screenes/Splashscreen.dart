import 'package:ambulance_tracker/screenes/auth.dart';
import 'package:flutter/material.dart';
import 'package:ambulance_tracker/services/auth_service.dart';

import 'package:ambulance_tracker/screenes/pagealert.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({Key? key}) : super(key: key);

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;
  late Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: const Duration(milliseconds: 800),
      vsync: this,
    );

    _scaleAnimation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.elasticOut,
      ),
    );

    _controller.forward();

    // Navigation après 1 seconde
    Future.delayed(const Duration(seconds: 1), () {
      _checkAuthAndNavigate();
    });
  }

  Future<void> _checkAuthAndNavigate() async {
    try {
      final token = await AuthService.getToken();

      if (!mounted) return;

      if (token != null && token.isNotEmpty) {
        Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => PageAlert(token: token)));
      } else {
        Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => AuthenticationPage()));
      }
    } catch (e) {
      if (mounted) {
        Navigator.of(context).pushReplacement(
            MaterialPageRoute(builder: (_) => AuthenticationPage()));
      }
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF1D3557), // Bleu foncé
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            // Logo animé
            ScaleTransition(
              scale: _scaleAnimation,
              child: Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 120,
                    height: 120,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE63946), // Rouge
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFFE63946).withOpacity(0.3),
                          blurRadius: 20,
                          spreadRadius: 5,
                        ),
                      ],
                    ),
                  ),
                  const Icon(
                    Icons.emergency_outlined,
                    size: 80,
                    color: Colors.white,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 30),

            // Titre
            ScaleTransition(
              scale: _scaleAnimation,
              child: const Column(
                children: [
                  Text(
                    'URGENCE',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      letterSpacing: 3,
                    ),
                  ),
                  SizedBox(height: 10),
                  Text(
                    'SERVICE D\'AMBULANCE',
                    style: TextStyle(
                      color: Color(0xFFE63946),
                      fontSize: 16,
                      fontWeight: FontWeight.w500,
                      letterSpacing: 2,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
