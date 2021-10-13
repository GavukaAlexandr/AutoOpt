import 'package:avto_opt/debounce.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:avto_opt/screens/order_car_parts.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class LoadingScreen extends StatefulWidget {
  const LoadingScreen({Key? key}) : super(key: key);

  @override
  _LoadingScreen createState() => _LoadingScreen();
}

class _LoadingScreen extends State<LoadingScreen> {
  final _debouncer = Debouncer(milliseconds: 1000);

  isToken() async {
    final prefs = await SharedPreferences.getInstance();
    var token = prefs.getString('token');

    if (token != null) {
      return _debouncer.run(() {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => const OrderCarParts()),
          (Route<dynamic> route) => false,
        );
      });
    } else {
      return _debouncer.run(() {
        Navigator.pushAndRemoveUntil(
          context,
          MaterialPageRoute(builder: (context) => Login()),
          (Route<dynamic> route) => false,
        );
      });
    }
  }

  @override
  void initState() {
    // healthCheck();
    isToken();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color(0xff2e3094),
        body: Center(
          child: Hero(
              tag: 'logo',
              child: CircleAvatar(
                backgroundColor: Colors.transparent,
                radius: 200.r,
                child: Image.asset(
                  'assets/background-loading.jpg',
                  fit: BoxFit.cover,
                ),
              )),
        ));
  }
}
