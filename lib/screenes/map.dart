import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:latlong2/latlong.dart';
import 'package:geolocator/geolocator.dart';
import 'package:ambulance_tracker/model/emergencu_model.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'dart:async';
import 'dart:math' show pi, atan2, cos, sin;

class MapScreen extends StatefulWidget {
  final Emergency? emergency;

  const MapScreen({
    Key? key,
    this.emergency,
  }) : super(key: key);

  @override
  State<MapScreen> createState() => _MapScreenState();
}

class _MapScreenState extends State<MapScreen> {
  final MapController _mapController = MapController();
  final List<Marker> _markers = [];
  List<LatLng> _routePoints = [];
  List<LatLng> _navigationTrack = [];

  LatLng? _currentPosition;
  LatLng? _emergencyLocation;
  bool _isLoading = false;
  bool _isNavigating = false;
  double _distanceToEmergency = 0.0;
  double _bearingToEmergency = 0.0;
  StreamSubscription<Position>? _positionStreamSubscription;
  String _navigationInstruction = '';

  @override
  void initState() {
    super.initState();
    if (widget.emergency != null) {
      _emergencyLocation = LatLng(
        widget.emergency!.patientLocation.latitude,
        widget.emergency!.patientLocation.longitude,
      );
    }
    _initializeLocationTracking();
  }

  Future<void> _initializeLocationTracking() async {
    setState(() => _isLoading = true);

    try {
      // Vérifier les permissions
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
        if (permission == LocationPermission.denied) {
          throw Exception('Location permissions are required');
        }
      }

      // Vérifier si le service de localisation est activé
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        throw Exception('Location services are disabled');
      }

      // Obtenir la position initiale
      Position position = await Geolocator.getCurrentPosition(
        desiredAccuracy: LocationAccuracy.high,
      );

      setState(() {
        _currentPosition = LatLng(position.latitude, position.longitude);
      });

      // Mettre à jour la carte
      _updateMarkersAndBearing();
      if (_emergencyLocation != null) {
        await _getRouteToEmergency();
        _fitMapToRoute();
      } else {
        _mapController.move(_currentPosition!, 15.0);
      }

      // Configurer le suivi continu
      const locationSettings = LocationSettings(
        accuracy: LocationAccuracy.high,
        distanceFilter: 5, // Mise à jour tous les 5 mètres
      );

      _positionStreamSubscription = Geolocator.getPositionStream(
        locationSettings: locationSettings,
      ).listen(
        (Position position) {
          if (!mounted) return;

          setState(() {
            _currentPosition = LatLng(position.latitude, position.longitude);

            if (_isNavigating) {
              _navigationTrack.add(_currentPosition!);
            }

            _updateMarkersAndBearing();

            if (_emergencyLocation != null) {
              _distanceToEmergency = Geolocator.distanceBetween(
                position.latitude,
                position.longitude,
                _emergencyLocation!.latitude,
                _emergencyLocation!.longitude,
              );
            }

            if (_isNavigating) {
              _mapController.move(_currentPosition!, _mapController.zoom);
            }
          });
        },
        onError: (error) {
          _showError('Location tracking error: $error');
        },
      );
    } catch (e) {
      _showError('Error initializing location tracking: $e');
    } finally {
      setState(() => _isLoading = false);
    }
  }

  double _calculateBearing(LatLng start, LatLng end) {
    final startLat = start.latitude * pi / 180;
    final startLng = start.longitude * pi / 180;
    final endLat = end.latitude * pi / 180;
    final endLng = end.longitude * pi / 180;

    final dLng = endLng - startLng;

    final y = sin(dLng) * cos(endLat);
    final x =
        cos(startLat) * sin(endLat) - sin(startLat) * cos(endLat) * cos(dLng);

    var bearing = atan2(y, x) * 180 / pi;
    bearing = (bearing + 360) % 360;
    return bearing;
  }

  String _getNavigationInstruction(double bearing) {
    if (bearing >= 337.5 || bearing < 22.5) {
      return 'Head North';
    } else if (bearing >= 22.5 && bearing < 67.5) {
      return 'Head Northeast';
    } else if (bearing >= 67.5 && bearing < 112.5) {
      return 'Head East';
    } else if (bearing >= 112.5 && bearing < 157.5) {
      return 'Head Southeast';
    } else if (bearing >= 157.5 && bearing < 202.5) {
      return 'Head South';
    } else if (bearing >= 202.5 && bearing < 247.5) {
      return 'Head Southwest';
    } else if (bearing >= 247.5 && bearing < 292.5) {
      return 'Head West';
    } else {
      return 'Head Northwest';
    }
  }

  void _updateMarkersAndBearing() {
    if (!mounted) return;

    setState(() {
      _markers.clear();

      if (_currentPosition != null) {
        if (_emergencyLocation != null) {
          _bearingToEmergency =
              _calculateBearing(_currentPosition!, _emergencyLocation!);
          _navigationInstruction =
              _getNavigationInstruction(_bearingToEmergency);
        }

        // Marqueur de position actuelle
        _markers.add(
          Marker(
            width: 60,
            height: 60,
            point: _currentPosition!,
            child: Transform.rotate(
              angle: (_bearingToEmergency * pi / 180),
              child: Container(
                decoration: BoxDecoration(
                  color: Colors.blue.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.navigation,
                  color: Colors.blue,
                  size: 50,
                ),
              ),
            ),
          ),
        );
      }

      // Marqueur d'urgence
      if (_emergencyLocation != null) {
        _markers.add(
          Marker(
            width: 40,
            height: 40,
            point: _emergencyLocation!,
            child: Container(
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.3),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.emergency,
                color: Colors.red,
                size: 40,
              ),
            ),
          ),
        );
      }
    });
  }

  Future<void> _getRouteToEmergency() async {
    if (_currentPosition == null || _emergencyLocation == null) return;

    try {
      String url = 'http://router.project-osrm.org/route/v1/driving/'
          '${_currentPosition!.longitude},${_currentPosition!.latitude};'
          '${_emergencyLocation!.longitude},${_emergencyLocation!.latitude}'
          '?overview=full&geometries=geojson&steps=true';

      final response = await http.get(Uri.parse(url));
      if (response.statusCode == 200) {
        var data = json.decode(response.body);
        List<dynamic> coordinates =
            data['routes'][0]['geometry']['coordinates'];

        setState(() {
          _routePoints = coordinates
              .map((coord) => LatLng(coord[1].toDouble(), coord[0].toDouble()))
              .toList();

          _distanceToEmergency = data['routes'][0]['distance'];
        });
      }
    } catch (e) {
      _showError('Route calculation error: $e');
    }
  }

  void _fitMapToRoute() {
    if (_routePoints.isEmpty) return;

    var bounds = LatLngBounds.fromPoints([
      if (_currentPosition != null) _currentPosition!,
      if (_emergencyLocation != null) _emergencyLocation!,
    ]);

    _mapController.fitBounds(
      bounds,
      options: const FitBoundsOptions(
        padding: EdgeInsets.all(50.0),
      ),
    );
  }

  void _showError(String message) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: Colors.red,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  void _startNavigation() {
    setState(() {
      _isNavigating = true;
      _navigationTrack.clear();
      if (_currentPosition != null) {
        _navigationTrack.add(_currentPosition!);
      }
    });
  }

  void _stopNavigation() {
    setState(() {
      _isNavigating = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Emergency: ${widget.emergency?.patientDetails ?? ""}'),
        backgroundColor: Colors.red,
      ),
      body: Stack(
        children: [
          FlutterMap(
            mapController: _mapController,
            options: MapOptions(
              initialCenter: _currentPosition ?? const LatLng(31.7917, -7.0926),
              initialZoom: 15.0,
              keepAlive: true,
            ),
            children: [
              TileLayer(
                urlTemplate: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
                userAgentPackageName: 'com.example.app',
              ),
              PolylineLayer(
                polylines: [
                  if (_routePoints.isNotEmpty)
                    Polyline(
                      points: _routePoints,
                      color: Colors.red,
                      strokeWidth: 4.0,
                    ),
                  if (_navigationTrack.isNotEmpty)
                    Polyline(
                      points: _navigationTrack,
                      color: Colors.green,
                      strokeWidth: 3.0,
                    ),
                ],
              ),
              MarkerLayer(markers: _markers),
            ],
          ),
          if (_isLoading)
            Container(
              color: Colors.black.withOpacity(0.3),
              child: const Center(child: CircularProgressIndicator()),
            ),
          if (_emergencyLocation != null && _routePoints.isNotEmpty)
            Positioned(
              bottom: 16,
              left: 16,
              right: 70,
              child: Card(
                color: Colors.white,
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'Emergency Details',
                        style: Theme.of(context).textTheme.titleMedium,
                      ),
                      const SizedBox(height: 8),
                      Text('Patient: ${widget.emergency!.patientDetails}'),
                      Text('ID: ${widget.emergency!.emergencyId}'),
                      Text(
                        'Distance: ${(_distanceToEmergency / 1000).toStringAsFixed(2)} km',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      Text(
                        'Direction: $_navigationInstruction',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      ElevatedButton.icon(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.red,
                          minimumSize: const Size(double.infinity, 45),
                        ),
                        onPressed: () {
                          if (_isNavigating) {
                            _stopNavigation();
                          } else {
                            _startNavigation();
                          }
                        },
                        icon:
                            Icon(_isNavigating ? Icons.stop : Icons.navigation),
                        label: Text(_isNavigating
                            ? 'Stop Navigation'
                            : 'Start Emergency Navigation'),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          Positioned(
            right: 16,
            bottom: 16,
            child: FloatingActionButton(
              onPressed: _initializeLocationTracking,
              child: const Icon(Icons.my_location),
              backgroundColor: Colors.white,
              foregroundColor: Colors.blue,
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _positionStreamSubscription?.cancel();
    _mapController.dispose();
    super.dispose();
  }
}
