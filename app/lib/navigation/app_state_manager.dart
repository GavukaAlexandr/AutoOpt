import 'package:avto_opt/health_cheaker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class AppStateManager extends ChangeNotifier {
  final storage = FlutterSecureStorage();

  bool _initialized = false;
  bool _registerIn = false;
  bool _loggedIn = false;
  bool _confirmedCode = false;
  bool _createdCar = false;
  bool _onOrder = false;
  bool _toProfile = false;
  bool _isToken = false;
  bool _isErrorPage = false;

  bool get isInitialized => _initialized;

  bool get isErrorPage => _isErrorPage;

  bool get isLoggedIn => _loggedIn;

  bool get registerIn => _registerIn;

  bool get confirmedCode => _confirmedCode;

  bool get createdCar => _createdCar;

  bool get onOrder => _onOrder;

  bool get onProfile => _toProfile;

  bool get isToken => _isToken;

  void initializeApp() async {
    final resultHealthCheck = await healthCheck();
    if (resultHealthCheck == false) {
      _initialized = true;
      _isErrorPage = true;
      notifyListeners();
    }

    String? value = await storage.read(key: 'token');

    if (value == null) {
      _initialized = true;
      _isToken = false;
      notifyListeners();
    } else if (value.isNotEmpty) {
      _initialized = true;
      _isToken = true;
      print(value);
      notifyListeners();
    }
  }

  void login() {
    _loggedIn = true;
    notifyListeners();
  }

  void logout() async {
    await storage.delete(key: 'token');
    _initialized = false;
    _registerIn = false;
    _loggedIn = false;
    _confirmedCode = false;
    _createdCar = false;
    _onOrder = false;
    _toProfile = false;
    _isToken = false;

    initializeApp();
    notifyListeners();
  }

  void register() {
    _registerIn = true;
    print(registerIn);
    print(isLoggedIn);
    notifyListeners();
  }

  void confirmCode() async {
    await storage.write(key: 'token', value: '123');

    _confirmedCode = true;
    _isToken = true;

    notifyListeners();
  }

  void createCar() {
    _createdCar = true;
    notifyListeners();
  }

  void toOrder() {
    _onOrder = true;
    notifyListeners();
  }

  void toProfile() {
    _toProfile = true;
    notifyListeners();
  }
}
