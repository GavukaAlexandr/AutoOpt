import 'package:avto_opt/debounce.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:avto_opt/screens/orderCarParts.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:page_transition/page_transition.dart';
import 'package:shared_preferences/shared_preferences.dart';

class LoadingScreen extends StatefulWidget {
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
          MaterialPageRoute(builder: (context) => OrderCarParts()),
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

  Route _createRoute() {
    return PageRouteBuilder(
      pageBuilder: (context, animation, secondaryAnimation) => Login(),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return child;
      },
    );
  }

  @override
  void initState() {
    isToken();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color(0xff2e3094),
        body: Container(
            child: Center(
          child: Hero(
              tag: 'logo',
              child: CircleAvatar(
                backgroundColor: Colors.transparent,
                radius: 200.0,
                child: Image.asset('assets/background-loading.jpg'),
              )),
        )));
  }
}
