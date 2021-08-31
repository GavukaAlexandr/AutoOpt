import 'package:avto_opt/screens/loading_screen.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:avto_opt/screens/orderCarParts.dart';
import 'package:avto_opt/screens/userProfile.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MaterialApp(
    initialRoute: '/',
    routes: {
      '/': (context) => LoadingScreen(),
      'login': (context) => Login(),
      'userProfile': (context) => UserProfile(),
      'order': (context) => OrderCarParts(),
    },
  ));
}
