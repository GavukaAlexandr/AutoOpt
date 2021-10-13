import 'dart:io';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter/material.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class ConnectionFaildScreen extends StatefulWidget {
  const ConnectionFaildScreen({Key? key}) : super(key: key);

  @override
  _ConnectionFaildScreen createState() => _ConnectionFaildScreen();
}

class _ConnectionFaildScreen extends State<ConnectionFaildScreen> {
  bool currentConnectionStatus = false;

  Connectivity connectivity = Connectivity();

  void checkConnectivity1() async {
    var connectivityResult = await connectivity.checkConnectivity();
    bool conn = getConnectionValue(connectivityResult);
    setState(() {
      currentConnectionStatus = conn;
    });
  }

  bool getConnectionValue(var connectivityResult) {
    return connectivityResult == ConnectivityResult.none ? false : true;
  }

  @override
  void initState() {
    checkConnectivity1();
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        fit: StackFit.expand,
        children: [
          currentConnectionStatus == false
              ? Image.asset(
                  "assets/connection-error.png",
                  fit: BoxFit.cover,
                )
              : Image.asset(
                  "assets/health-error.png",
                  fit: BoxFit.cover,
                ),
          Positioned.fill(
              top: 0.38.sh,
              child: Align(
                alignment: Alignment.center,
                child: Container(
                  padding: const EdgeInsets.only(right: 20, left: 20),
                  child: currentConnectionStatus == false
                      ? Text('ethernet_connection_error'.tr(),
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 24.sp,
                            letterSpacing: 1,
                            fontFamily: 'Montserrat',
                          ))
                      : Text('server_connection_error'.tr(),
                          style: TextStyle(
                            fontSize: 24.sp,
                            letterSpacing: 1,
                            fontFamily: 'Montserrat',
                          )),
                ),
              )),
          Positioned.fill(
            bottom: 0.13.sh,
            left: 0.05.sw,
            child: Align(
              alignment: Alignment.bottomLeft,
              child: Container(
                child: currentConnectionStatus == false
                    ? SizedBox(
                        height: 35.h,
                        width: 0.5.sw,
                        child: Material(
                          borderRadius: BorderRadius.circular(18.r),
                          color: Colors.white,
                          elevation: 7.0,
                          child: TextButton(
                            onPressed: () async {
                              exit(0);
                            },
                            child: Text(
                              "exit_btn".tr(),
                              style: const TextStyle(color: Colors.black),
                            ),
                          ),
                        ),
                      )
                    : SizedBox(
                        height: 35.h,
                        width: 0.5.sw,
                        child: Material(
                          borderRadius: BorderRadius.circular(18.r),
                          color: Colors.black,
                          elevation: 7.0,
                          child: TextButton(
                            onPressed: () async {
                              exit(0);
                            },
                            child: Text(
                              "exit_btn".tr(),
                              style: const TextStyle(color: Colors.white),
                            ),
                          ),
                        ),
                      ),
              ),
            ),
          )
        ],
      ),
    );
  }
}
