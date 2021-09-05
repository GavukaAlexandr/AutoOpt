import 'package:flutter/material.dart';

final lightTheme = ThemeData.light().copyWith(
  primaryColor: Color(0xff2e3094),
  accentColor: Color(0xff2e3094),
  backgroundColor: Colors.grey[300],
      floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: Colors.black87
    )
  
);
final darkTheme = ThemeData.dark().copyWith(
    primaryColor: Colors.blue,
    accentColor: Colors.blue,
    floatingActionButtonTheme: FloatingActionButtonThemeData(
      backgroundColor: Colors.white70
    )
);