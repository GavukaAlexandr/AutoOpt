import 'package:flutter/material.dart';
import 'package:avto_opt/screens/orderCarParts.dart';
import 'package:avto_opt/screens/userProfile.dart';

void main() => runApp(MaterialApp(
      initialRoute: '/',
      routes: {
        '/': (context) => OrderCarParts(),
        'userProfile': (context) => UserProfile()
      },
    ));
