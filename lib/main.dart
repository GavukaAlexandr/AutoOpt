import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:avto_opt/assets_loader.dart';
import 'package:avto_opt/health_cheaker.dart';
import 'package:avto_opt/screens/error_connection_screen.dart';
import 'package:avto_opt/screens/loading_screen.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:avto_opt/themes.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:avto_opt/screens/order_car_parts.dart';
import 'package:avto_opt/screens/user_profile.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:easy_localization/easy_localization.dart';
import 'dart:ui';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();
  await Firebase.initializeApp();
  
  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('en', 'US'), Locale('ru', 'RU')],
      //? DEV: path: 'http://192.168.88.30:3000/public/app-localizations',
      path: 'https://auto-opt.cyber-geeks-lab.synology.me/public/app-localizations',
      fallbackLocale: const Locale('en', 'US'),
      assetLoader: HttpAssetLoader(),
      child: await healthCheck() != false ? const MyApp() : const ErrorConnectionServer(),
    ),
  );
}

class ErrorConnectionServer extends StatelessWidget {
  const ErrorConnectionServer({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(360, 690),
      builder: () => MaterialApp(
        locale: context.locale,
        debugShowCheckedModeBanner: false,
        localizationsDelegates: context.localizationDelegates,
        supportedLocales: context.supportedLocales,
        home: const ConnectionFaildScreen(),
      ),
    );
  }
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ScreenUtilInit(
      designSize: const Size(360, 690),
      builder: () => AdaptiveTheme(
        light: lightTheme,
        dark: darkTheme,
        initial: AdaptiveThemeMode.system,
        builder: (light, dark) => MaterialApp(
          locale: context.locale,
          debugShowCheckedModeBanner: false,
          theme: light,
          darkTheme: dark,
          localizationsDelegates: context.localizationDelegates,
          supportedLocales: context.supportedLocales,
          initialRoute: '/',
          routes: {
            '/': (context) => LoadingScreen(),
            'login': (context) => Login(),
            'userProfile': (context) => const UserProfile(),
            'order': (context) => const OrderCarParts(),
          },
        ),
      ),
    );
  }
}
