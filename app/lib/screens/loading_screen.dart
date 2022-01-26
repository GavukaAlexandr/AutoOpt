import 'package:avto_opt/navigation/app_state_manager.dart';
import 'package:avto_opt/navigation/ui_pages.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class SplashPage extends StatefulWidget {
  const SplashPage({Key? key}) : super(key: key);

  static MaterialPage page() {
    return const MaterialPage(
      name: splashPath,
      key: ValueKey(splashPath),
      child: SplashPage(),
    );
  }

  @override
  _SplashPage createState() => _SplashPage();
}

class _SplashPage extends State<SplashPage> {
  // isToken() async {
  //   final prefs = await SharedPreferences.getInstance();
  //   var token = prefs.getString('token');
  //
  //   if (token != null) {
  //     return _debouncer.run(() {
  //       Navigator.pushAndRemoveUntil(
  //         context,
  //         MaterialPageRoute(builder: (context) => const OrderCarParts()),
  //         (Route<dynamic> route) => false,
  //       );
  //     });
  //   } else {
  //     return _debouncer.run(() {
  //       Navigator.pushAndRemoveUntil(
  //         context,
  //         MaterialPageRoute(builder: (context) => Login()),
  //         (Route<dynamic> route) => false,
  //       );
  //     });
  //   }
  // }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    Provider.of<AppStateManager>(context, listen: false).initializeApp();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xff2e3094),
      body: Center(
        child: Image.asset(
          'assets/background-loading.jpg',
          fit: BoxFit.cover,
          height: 250,
          width: MediaQuery.of(context).size.width,
        ),
      ),
    );
  }
}
