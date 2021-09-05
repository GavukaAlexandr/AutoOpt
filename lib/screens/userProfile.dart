import 'dart:developer';
import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:avto_opt/generated/l10n.dart';
import 'package:avto_opt/my_flutter_app_icons.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_overlay/loading_overlay.dart';
import './../state/user_form_store.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class UserProfile extends StatefulWidget {
  const UserProfile({Key? key}) : super(key: key);

  @override
  _UserProfile createState() => _UserProfile();
}

class _UserProfile extends State<UserProfile> {
  var currentFocus;
  Icon iconTheme = Icon(Icons.light_mode);
  final userFormStore = UserFormStore();
  final formKey = GlobalKey<FormState>();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();

  isToken() async {
    final prefs = await SharedPreferences.getInstance();
    var token = prefs.getString('token');

    if (token != null) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => Login()),
      (Route<dynamic> route) => false,
    );
  }

  @override
  void initState() {
    super.initState();
    isToken();
    userFormStore.getSelf();
  }

  unfocus() {
    currentFocus = FocusScope.of(context);
    if (!currentFocus.hasPrimaryFocus) {
      currentFocus.unfocus();
    }
  }

  save() {
    if (!userFormStore.user.notificationPhone &&
        !userFormStore.user.notificationTelegram &&
        !userFormStore.user.notificationViber) {
      _scaffoldKey.currentState!.showSnackBar(SnackBar(
        content: Text(S.of(context).profile_error_notification),
        duration: Duration(milliseconds: 4000),
        backgroundColor: Colors.red,
      ));
    } else {
      userFormStore.changeNotification();
    }
  }

  @override
  void dispose() {
    super.dispose();
  }

  getCurrentTheme() async {
    final savedThemeMode = await AdaptiveTheme.getThemeMode();
    return savedThemeMode;
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        key: _scaffoldKey,
        floatingActionButton: FloatingActionButton(
            backgroundColor:
                Theme.of(context).floatingActionButtonTheme.backgroundColor,
            onPressed: () async {
              if (await getCurrentTheme() == AdaptiveThemeMode.light) {
                AdaptiveTheme.of(context).setDark();
                iconTheme = Icon(Icons.light_mode);
                return setState(() {});
              } else {
                AdaptiveTheme.of(context).setLight();
                iconTheme = Icon(Icons.dark_mode);
                return setState(() {});
              }
            },
            child: iconTheme),
        appBar: AppBar(
          title: Text(S.of(context).profile_app_bar),
          centerTitle: true,
          backgroundColor: Theme.of(context).primaryColor,
          elevation: 0.0,
        ),
        body: Observer(
            builder: (_) => LoadingOverlay(
                color: Colors.black54,
                isLoading: userFormStore.loaderStatus,
                child: Center(
                  child: Container(
                    width: double.infinity,
                    child: Stack(
                      children: <Widget>[
                        ClipPath(
                          child:
                              Container(color: Theme.of(context).primaryColor),
                          clipper: getClipper(),
                        ),
                        Positioned(
                            width: 1.sw,
                            top: 0.1.sh,
                            child: Column(
                              children: <Widget>[
                                _AvatarWidget(),
                                SizedBox(height: 50.h),
                                _UserNameWidget(userFormStore: userFormStore),
                                SizedBox(height: 10.h),
                                _UserEmailWidget(userFormStore: userFormStore),
                                SizedBox(height: 10.h),
                                _UserPhoneWidget(userFormStore: userFormStore),
                                SizedBox(height: 15.h),
                                _FeedbackTitleWidget(),
                                SizedBox(height: 10.h),
                                Container(
                                  child: Row(
                                    mainAxisAlignment:
                                        MainAxisAlignment.spaceEvenly,
                                    children: [
                                      Observer(
                                        builder: (_) => SizedBox(
                                          width: 60.w,
                                          height: 60.h,
                                          child: IconButton(
                                            icon: Icon(
                                              MyFlutterApp.local_phone,
                                              size: 40.sp,
                                            ),
                                            color: userFormStore
                                                    .user.notificationPhone
                                                ? Colors.green
                                                : Colors.grey,
                                            onPressed: () {
                                              userFormStore.setNotification(
                                                  'phone',
                                                  !userFormStore
                                                      .user.notificationPhone);
                                              userFormStore.changeEditing(true);
                                            },
                                          ),
                                        ),
                                      ),
                                      Observer(
                                        builder: (_) => SizedBox(
                                          width: 60.w,
                                          height: 60.h,
                                          child: IconButton(
                                            icon: Icon(
                                              MyFlutterApp.telegram_plane,
                                              size: 40.sp,
                                            ),
                                            color: userFormStore
                                                    .user.notificationTelegram
                                                ? Colors.blue
                                                : Colors.grey,
                                            onPressed: () {
                                              userFormStore.setNotification(
                                                  'telegram',
                                                  !userFormStore.user
                                                      .notificationTelegram);
                                              userFormStore.changeEditing(true);
                                            },
                                          ),
                                        ),
                                      ),
                                      Observer(
                                        builder: (_) => SizedBox(
                                          width: 60.w,
                                          height: 60.h,
                                          child: IconButton(
                                            icon: Icon(
                                              MyFlutterApp.viber,
                                              size: 40.sp,
                                            ),
                                            color: userFormStore
                                                    .user.notificationViber
                                                ? Colors.purple
                                                : Colors.grey,
                                            onPressed: () {
                                              userFormStore.setNotification(
                                                  'viber',
                                                  !userFormStore
                                                      .user.notificationViber);
                                              userFormStore.changeEditing(true);
                                            },
                                          ),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                SizedBox(
                                  height: 30.h,
                                ),
                                Container(
                                    height: 35.h,
                                    width: 160.w,
                                    child: Material(
                                      borderRadius: BorderRadius.circular(20.0),
                                      color: Theme.of(context).accentColor,
                                      elevation: 7.0,
                                      child: TextButton(
                                        onPressed: () {},
                                        child: Center(
                                          child: Text(
                                            S
                                                .of(context)
                                                .profile_order_history_btn,
                                            style: TextStyle(
                                                color: Colors.white,
                                                fontSize: 14.sp,
                                                letterSpacing: 1,
                                                fontWeight: FontWeight.w400,
                                                fontFamily: 'Montserrat'),
                                          ),
                                        ),
                                      ),
                                    )),
                                SizedBox(height: 20.h),
                                userFormStore.isEditing
                                    ? Container(
                                        height: 35.h,
                                        width: 160.w,
                                        child: Material(
                                          borderRadius:
                                              BorderRadius.circular(20.0),
                                          color: Colors.green,
                                          elevation: 7.0,
                                          child: TextButton(
                                            onPressed: () {
                                              save();
                                            },
                                            child: Center(
                                              child: Text(
                                                S.of(context).profile_save_btn,
                                                style: TextStyle(
                                                    color: Colors.white,
                                                    fontSize: 14.sp,
                                                    letterSpacing: 1,
                                                    fontWeight: FontWeight.w400,
                                                    fontFamily: 'Montserrat'),
                                              ),
                                            ),
                                          ),
                                        ))
                                    : Container(
                                        height: 35.h,
                                        width: 160.w,
                                        child: Material(
                                          borderRadius:
                                              BorderRadius.circular(20.0),
                                          color: Colors.red,
                                          elevation: 7.0,
                                          child: TextButton(
                                            onPressed: () async {
                                              final prefs =
                                                  await SharedPreferences
                                                      .getInstance();
                                              prefs.clear();
                                              Navigator.pushAndRemoveUntil(
                                                context,
                                                MaterialPageRoute(
                                                    builder: (context) =>
                                                        Login()),
                                                (Route<dynamic> route) => false,
                                              );
                                            },
                                            child: Center(
                                              child: Text(
                                                S.of(context).profile_exit_btn,
                                                style: TextStyle(
                                                    fontSize: 14.sp,
                                                    letterSpacing: 4,
                                                    fontWeight: FontWeight.w400,
                                                    color: Colors.white,
                                                    fontFamily: 'Montserrat'),
                                              ),
                                            ),
                                          ),
                                        ))
                              ],
                            ))
                      ],
                    ),
                  ),
                ))));
  }
}

class _FeedbackTitleWidget extends StatelessWidget {
  const _FeedbackTitleWidget({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Text(
      S.of(context).profile_feedback,
      style: TextStyle(
          fontSize: 19.sp,
          letterSpacing: 2,
          color: Theme.of(context).accentColor,
          fontWeight: FontWeight.bold,
          fontFamily: 'Montserrat'),
    );
  }
}

class _UserPhoneWidget extends StatelessWidget {
  const _UserPhoneWidget({
    Key? key,
    required this.userFormStore,
  }) : super(key: key);

  final UserFormStore userFormStore;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          Icons.phone_enabled_outlined,
          size: 24,
        ),
        SizedBox(
          width: 8.w,
        ),
        Observer(
          builder: (_) => Text(
            '${userFormStore.user.phoneNumber}',
            style: TextStyle(
                fontSize: 18.sp,
                letterSpacing: 1,
                fontWeight: FontWeight.w300,
                fontFamily: 'Montserrat'),
          ),
        ),
      ],
    );
  }
}

class _UserEmailWidget extends StatelessWidget {
  const _UserEmailWidget({
    Key? key,
    required this.userFormStore,
  }) : super(key: key);

  final UserFormStore userFormStore;

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Icon(
          Icons.email_outlined,
          size: 24,
        ),
        SizedBox(
          width: 8.w,
        ),
        Observer(
          builder: (_) => Text(
            '${userFormStore.user.email} ',
            style: TextStyle(
                fontSize: 18.sp,
                fontWeight: FontWeight.w300,
                fontFamily: 'Montserrat'),
          ),
        ),
      ],
    );
  }
}

class _UserNameWidget extends StatelessWidget {
  const _UserNameWidget({
    Key? key,
    required this.userFormStore,
  }) : super(key: key);

  final UserFormStore userFormStore;

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) => Text(
        '${userFormStore.user.firstName} ${userFormStore.user.lastName}',
        style: TextStyle(
            fontSize: 26.sp,
            letterSpacing: 1,
            fontWeight: FontWeight.w400,
            fontFamily: 'Montserrat'),
      ),
    );
  }
}

class _AvatarWidget extends StatelessWidget {
  const _AvatarWidget({
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return CircleAvatar(
      radius: 65.r,
      backgroundColor: Theme.of(context).backgroundColor,
      child: Icon(
        Icons.person,
        size: 65.sp,
        color: Colors.black45,
      ),
    );
    // (
    //   width: 120.w,
    //   height: 120.h,
    //   decoration: BoxDecoration(
    //     color: Theme.of(context).backgroundColor,
    //     borderRadius: BorderRadius.all(Radius.circular(75.r)),
    //     boxShadow: [BoxShadow(blurRadius: 8.r, color: Colors.black)],
    //   ),
    // );
  }
}

class getClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = new Path();

    path.lineTo(0.0.h, 0.4.sh);
    path.lineTo(1.sw, 0.0.w);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return true;
  }
}
