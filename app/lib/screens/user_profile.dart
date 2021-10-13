import 'package:adaptive_theme/adaptive_theme.dart';
import 'package:avto_opt/my_flutter_app_icons.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_overlay/loading_overlay.dart';
import './../state/user_form_store.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:easy_localization/easy_localization.dart';

class UserProfile extends StatefulWidget {
  const UserProfile({Key? key}) : super(key: key);

  @override
  _UserProfile createState() => _UserProfile();
}

class _UserProfile extends State<UserProfile> {
  var currentFocus;
  Icon iconTheme = const Icon(Icons.light_mode);
  final userFormStore = UserFormStore();
  final formKey = GlobalKey<FormState>();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();

  @override
  void initState() {
    super.initState();
    userFormStore.getSelf();
  }

  unfocus() {
    currentFocus = FocusScope.of(context);
    if (!currentFocus.hasPrimaryFocus) {
      currentFocus.unfocus();
    }
  }

  save() {
    if (!userFormStore.user.notificationPhone && !userFormStore.user.notificationTelegram && !userFormStore.user.notificationViber) {
      _scaffoldKey.currentState!.showSnackBar(SnackBar(
        content: Text('profile_error_notification'.tr()),
        duration: const Duration(milliseconds: 4000),
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
    return Scaffold(
        key: _scaffoldKey,
        // floatingActionButton: FloatingActionButton(
        //     backgroundColor:
        //         Theme.of(context).floatingActionButtonTheme.backgroundColor,
        //     onPressed: () async {
        //       if (await getCurrentTheme() == AdaptiveThemeMode.light) {
        //         AdaptiveTheme.of(context).setDark();
        //         iconTheme = const Icon(Icons.light_mode);
        //         return setState(() {});
        //       } else {
        //         AdaptiveTheme.of(context).setLight();
        //         iconTheme = const Icon(Icons.dark_mode);
        //         return setState(() {});
        //       }
        //     },
        //     child: iconTheme),
        appBar: AppBar(
          title: Text('profile_app_bar'.tr()),
          centerTitle: true,
          backgroundColor: Theme.of(context).primaryColor,
          elevation: 0.0,
        ),
        body: Observer(
            builder: (_) => LoadingOverlay(
                color: Colors.black54,
                isLoading: userFormStore.loaderStatus,
                child: Center(
                  child: SizedBox(
                    width: double.infinity,
                    child: Stack(
                      children: <Widget>[
                        ClipPath(
                          child: Container(color: Theme.of(context).primaryColor),
                          clipper: GetClipper(),
                        ),
                        Positioned(
                            width: 1.sw,
                            top: 0.1.sh,
                            child: Column(
                              children: <Widget>[
                                const _AvatarWidget(),
                                SizedBox(height: 50.h),
                                _UserNameWidget(userFormStore: userFormStore),
                                SizedBox(height: 10.h),
                                _UserEmailWidget(userFormStore: userFormStore),
                                SizedBox(height: 10.h),
                                _UserPhoneWidget(userFormStore: userFormStore),
                                SizedBox(height: 15.h),
                                const _FeedbackTitleWidget(),
                                SizedBox(height: 10.h),
                                Row(
                                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
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
                                          color: userFormStore.user.notificationPhone ? Colors.green : Colors.grey,
                                          onPressed: () {
                                            userFormStore.setNotification('phone', !userFormStore.user.notificationPhone);
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
                                          color: userFormStore.user.notificationTelegram ? Colors.blue : Colors.grey,
                                          onPressed: () {
                                            userFormStore.setNotification('telegram', !userFormStore.user.notificationTelegram);
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
                                          color: userFormStore.user.notificationViber ? Colors.purple : Colors.grey,
                                          onPressed: () {
                                            userFormStore.setNotification('viber', !userFormStore.user.notificationViber);
                                            userFormStore.changeEditing(true);
                                          },
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                                SizedBox(
                                  height: 25.h,
                                ),
                                SizedBox(height: 20.h),
                                userFormStore.isEditing
                                    ? SizedBox(
                                        height: 45.h,
                                        width: 200.w,
                                        child: Material(
                                          borderRadius: BorderRadius.circular(20.r),
                                          color: Colors.green,
                                          elevation: 7.0,
                                          child: TextButton(
                                            onPressed: () {
                                              save();
                                              userFormStore.changeEditing(false);
                                            },
                                            child: Center(
                                              child: Text(
                                                'profile_save_btn'.tr(),
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
                                        padding: EdgeInsets.only(bottom: 5.sp),
                                        height: 45.h,
                                        width: 200.w,
                                        child: Material(
                                          borderRadius: BorderRadius.circular(20.r),
                                          color: Colors.red,
                                          elevation: 7.0,
                                          child: TextButton(
                                            onPressed: () async {
                                              final prefs = await SharedPreferences.getInstance();
                                              prefs.clear();
                                              Navigator.pushAndRemoveUntil(
                                                context,
                                                MaterialPageRoute(builder: (context) => const Login()),
                                                (Route<dynamic> route) => false,
                                              );
                                            },
                                            child: Text(
                                              'exit_btn'.tr(),
                                              style: TextStyle(
                                                  fontSize: 14.sp,
                                                  letterSpacing: 2.sp,
                                                  fontWeight: FontWeight.w400,
                                                  color: Colors.white,
                                                  fontFamily: 'Montserrat'),
                                            ),
                                          ),
                                        ),
                                      ),
                              ],
                            )),
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
      'feedback'.tr(),
      style: TextStyle(
          fontSize: 18.sp, letterSpacing: 2, color: Theme.of(context).primaryColor, fontWeight: FontWeight.bold, fontFamily: 'Montserrat'),
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
        const Icon(
          Icons.phone_enabled_outlined,
          size: 24,
        ),
        SizedBox(
          width: 8.w,
        ),
        Observer(
          builder: (_) => Text(
            userFormStore.user.phoneNumber,
            style: TextStyle(fontSize: 16.sp, letterSpacing: 1, fontWeight: FontWeight.w300, fontFamily: 'Montserrat'),
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
        const Icon(
          Icons.email_outlined,
          size: 24,
        ),
        SizedBox(
          width: 8.w,
        ),
        Observer(
          builder: (_) => Text(
            '${userFormStore.user.email} ',
            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.w300, fontFamily: 'Montserrat'),
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
        style: TextStyle(fontSize: 18.sp, letterSpacing: 1, fontWeight: FontWeight.w400, fontFamily: 'Montserrat'),
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
  }
}

class GetClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = Path();

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
