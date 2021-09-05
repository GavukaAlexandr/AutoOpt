import 'package:avto_opt/screens/loading_screen.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:avto_opt/screens/orderCarParts.dart';
import 'package:avto_opt/screens/userProfile.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'generated/l10n.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return new MaterialApp(
      localizationsDelegates: [
        S.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      supportedLocales: S.delegate.supportedLocales,
      initialRoute: '/',
      routes: {
        '/': (context) => LoadingScreen(),
        'login': (context) => Login(),
        'userProfile': (context) => UserProfile(),
        'order': (context) => OrderCarParts(),
      },
    );
  }
}
