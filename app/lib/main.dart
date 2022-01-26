import 'package:avto_opt/navigation/app_router.dart';
import 'package:avto_opt/navigation/app_state_manager.dart';
import 'package:avto_opt/screens/login/widgets/login_repository.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // await EasyLocalization.ensureInitialized();
  await Firebase.initializeApp();

  runApp(
    //   EasyLocalization(
    //     supportedLocales: const [Locale('en', 'US'), Locale('ru', 'RU')],
    //     //? DEV: path: 'http://192.168.88.30:3000/public/app-localizations',
    //     path:
    //         'https://auto-opt.cyber-geeks-lab.synology.me/public/app-localizations',
    //     fallbackLocale: const Locale('en', 'US'),
    //     assetLoader: HttpAssetLoader(),
    //     child: await healthCheck() != false
    //         ? MyApp()
    //         : const ErrorConnectionServer(),
    //   ),
    // );
    const MyApp(),
  );
}

class MyApp extends StatefulWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final _appStateManager = AppStateManager();
  final _authFireBaseManager = LoginRepository();
  late AppRouter _appRouter;

  @override
  void initState() {
    super.initState();
    _appRouter = AppRouter(
        appStateManager: _appStateManager,
        authFireBaseManager: _authFireBaseManager);
  }

  @override
  Widget build(BuildContext context) {
    // return ScreenUtilInit(
    //   designSize: const Size(360, 690),
    //   builder: () => AdaptiveTheme(
    //     light: lightTheme,
    //     dark: darkTheme,
    //     initial: AdaptiveThemeMode.system,
    //     builder: (light, dark) => MaterialApp(
    //       locale: context.locale,
    //       debugShowCheckedModeBanner: false,
    //       theme: light,
    //       darkTheme: dark,
    //       localizationsDelegates: context.localizationDelegates,
    //       supportedLocales: context.supportedLocales,
    //       initialRoute: '/',
    //       routes: {
    //         '/': (context) => LoadingScreen(),
    //         'login': (context) => Login(),
    //         'userProfile': (context) => const UserProfile(),
    //         'order': (context) => const OrderCarParts(),
    //       },
    //     ),
    //   ),
    // );
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(
          create: (context) => _appStateManager,
        ),
        ChangeNotifierProvider(
          create: (context) => _authFireBaseManager,
        ),
      ],
      child: MaterialApp(
        home: Router(
          routerDelegate: _appRouter,
          // backButtonDispatcher: RootBackButtonDispatcher(),
        ),
      ),
    );
  }
}
