import 'package:flutter/material.dart';
import 'package:ambulance_tracker/services/auth_service.dart';
import 'package:ambulance_tracker/screenes/pagealert.dart';
import 'package:ambulance_tracker/model/auth_model.dart';

class AuthenticationPage extends StatefulWidget {
  @override
  _AuthenticationPageState createState() => _AuthenticationPageState();
}

class _AuthenticationPageState extends State<AuthenticationPage> {
  final TextEditingController employeeIdController = TextEditingController();
  final TextEditingController pinController = TextEditingController();
  final TextEditingController deviceIdController = TextEditingController();
  bool isLoading = false;
  bool obscurePin = true;

  final Color primaryRed = const Color(0xFFE63946);
  final Color secondaryBlue = const Color(0xFF457B9D);
  final Color backgroundDark = const Color(0xFF1D3557);
  final Color lightGrey = const Color(0xFFF1FAEE);

  @override
  void initState() {
    super.initState();
    _checkExistingToken();
  }

  Future<void> _checkExistingToken() async {
    setState(() {
      isLoading = true;
    });

    try {
      final token = await AuthService.getToken();
      if (token != null && token.isNotEmpty) {
        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => PageAlert(token: token),
            ),
          );
        }
      }
    } catch (e) {
      print('Erreur lors de la vérification du token: $e');
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  void _showError(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: primaryRed,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: EdgeInsets.all(10),
      ),
    );
  }

  void _showSuccess(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.green,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: EdgeInsets.all(10),
      ),
    );
  }

  Future<void> _handleLogin() async {
    if (employeeIdController.text.isEmpty ||
        pinController.text.isEmpty ||
        deviceIdController.text.isEmpty) {
      _showError('Veuillez remplir tous les champs');
      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final authResponse = await AuthService.login(
        employeeId: employeeIdController.text,
        pin: pinController.text,
        deviceId: deviceIdController.text,
      );

      if (authResponse.success && authResponse.data != null) {
        _showSuccess('Connexion réussie');

        await Future.delayed(const Duration(milliseconds: 500));

        if (mounted) {
          Navigator.pushReplacement(
            context,
            MaterialPageRoute(
              builder: (context) => PageAlert(token: authResponse.data!.token),
            ),
          );
        }
      } else {
        _showError(authResponse.message);
      }
    } catch (e) {
      _showError('Erreur de connexion: $e');
    } finally {
      if (mounted) {
        setState(() {
          isLoading = false;
        });
      }
    }
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
    bool isPassword = false,
    TextInputType keyboardType = TextInputType.text,
  }) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.1),
            blurRadius: 10,
            offset: Offset(0, 5),
          ),
        ],
      ),
      child: TextField(
        controller: controller,
        obscureText: isPassword && obscurePin,
        keyboardType: keyboardType,
        style: TextStyle(color: backgroundDark),
        decoration: InputDecoration(
          prefixIcon: Icon(icon, color: secondaryBlue),
          suffixIcon: isPassword
              ? IconButton(
                  icon: Icon(
                    obscurePin ? Icons.visibility_off : Icons.visibility,
                    color: secondaryBlue,
                  ),
                  onPressed: () {
                    setState(() {
                      obscurePin = !obscurePin;
                    });
                  },
                )
              : null,
          hintText: hintText,
          hintStyle: TextStyle(color: Colors.grey),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 15),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: backgroundDark,
      body: Stack(
        children: [
          Positioned(
            top: -100,
            right: -100,
            child: Icon(
              Icons.local_hospital,
              size: 300,
              color: secondaryBlue.withOpacity(0.1),
            ),
          ),
          Center(
            child: SingleChildScrollView(
              child: Padding(
                padding: const EdgeInsets.all(20.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: EdgeInsets.all(20),
                      decoration: BoxDecoration(
                        color: primaryRed,
                        shape: BoxShape.circle,
                      ),
                      child: Icon(
                        Icons.emergency,
                        size: 60,
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: 30),
                    Text(
                      'AMBULANCE LOGIN',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 28,
                        fontWeight: FontWeight.bold,
                        letterSpacing: 2,
                      ),
                    ),
                    SizedBox(height: 40),
                    _buildInputField(
                      controller: employeeIdController,
                      hintText: 'Employee ID',
                      icon: Icons.person_outline,
                    ),
                    _buildInputField(
                      controller: pinController,
                      hintText: 'PIN Code',
                      icon: Icons.lock_outline,
                      isPassword: true,
                      keyboardType: TextInputType.number,
                    ),
                    _buildInputField(
                      controller: deviceIdController,
                      hintText: 'Device ID',
                      icon: Icons.phonelink_setup,
                    ),
                    SizedBox(height: 40),
                    GestureDetector(
                      onTap: isLoading ? null : _handleLogin,
                      child: Container(
                        width: double.infinity,
                        height: 55,
                        decoration: BoxDecoration(
                          gradient: LinearGradient(
                            colors: [primaryRed, primaryRed.withOpacity(0.8)],
                            begin: Alignment.centerLeft,
                            end: Alignment.centerRight,
                          ),
                          borderRadius: BorderRadius.circular(15),
                          boxShadow: [
                            BoxShadow(
                              color: primaryRed.withOpacity(0.3),
                              blurRadius: 10,
                              offset: Offset(0, 5),
                            ),
                          ],
                        ),
                        child: Center(
                          child: isLoading
                              ? CircularProgressIndicator(color: Colors.white)
                              : Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    Icon(
                                      Icons.login,
                                      color: Colors.white,
                                    ),
                                    SizedBox(width: 10),
                                    Text(
                                      'CONNECT',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 20,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 1,
                                      ),
                                    ),
                                  ],
                                ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    employeeIdController.dispose();
    pinController.dispose();
    deviceIdController.dispose();
    super.dispose();
  }
}
