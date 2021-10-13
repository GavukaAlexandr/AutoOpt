import 'package:flutter/material.dart';

final lightTheme = ThemeData.light().copyWith(
  primaryColor: const Color(0xff2e3094),
  backgroundColor: Colors.grey[300],
      floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: Colors.black87
    ), colorScheme: ColorScheme.fromSwatch().copyWith(secondary: const Color(0xff2e3094))
  
);
final darkTheme = ThemeData.dark().copyWith(
    primaryColor: Colors.blue,
    floatingActionButtonTheme: const FloatingActionButtonThemeData(
      backgroundColor: Colors.white70
    ), colorScheme: ColorScheme.fromSwatch().copyWith(secondary: Colors.blue)
);