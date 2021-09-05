import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:avto_opt/screens/loading_screen.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:avto_opt/themes.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:avto_opt/screens/orderCarParts.dart';
import 'package:avto_opt/screens/userProfile.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:device_preview/device_preview.dart';
import 'generated/l10n.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  runApp(DevicePreview(
    enabled: !kReleaseMode,
    builder: (context) => MyApp(), // Wrap your app
  ));
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: Size(360, 690),
      builder: () => AdaptiveTheme(
        light: lightTheme,
        dark: darkTheme,
        initial: AdaptiveThemeMode.system,
        builder: (light, dark) => MaterialApp(
          locale: DevicePreview.locale(context),
          builder: DevicePreview.appBuilder, 
          debugShowCheckedModeBanner: false,
          theme: light,
          darkTheme: dark,
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
        ),
      ),
    );
  }
}
