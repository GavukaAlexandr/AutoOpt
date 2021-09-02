import 'dart:developer';
import 'package:avto_opt/my_flutter_app_icons.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_overlay/loading_overlay.dart';
import './../state/user_form_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProfile extends StatefulWidget {
  const UserProfile({Key? key}) : super(key: key);

  @override
  _UserProfile createState() => _UserProfile();
}

class _UserProfile extends State<UserProfile> {
  var currentFocus;

  final userFormStore = UserFormStore();
  final formKey = GlobalKey<FormState>();
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();
  final myUserNameController = TextEditingController();
  final myUserEmailController = TextEditingController();
  final myUserPhoneController = TextEditingController();
  bool isEditing = false;

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
          content: Text('Выберите хотя бы один способ обратной связи'),
          duration: Duration(milliseconds: 4000),
          backgroundColor: Colors.red,
        ));
    } else {
      
    }
  }

  @override
  void dispose() {
    myUserNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        key: _scaffoldKey,
        appBar: AppBar(
          title: Text('Профиль'),
          centerTitle: true,
          backgroundColor: Color(0xff2e3094).withOpacity(0.9),
          elevation: 0.0,
        ),
        body: Observer(
            builder: (_) => LoadingOverlay(
                color: Colors.black54,
                isLoading: userFormStore.loaderStatus,
                child: new Stack(
                  children: <Widget>[
                    ClipPath(
                      child:
                          Container(color: Color(0xff2e3094).withOpacity(0.9)),
                      clipper: getClipper(),
                    ),
                    Positioned(
                        width: MediaQuery.of(context).size.width,
                        top: MediaQuery.of(context).size.height / 8,
                        child: Column(
                          children: <Widget>[
                            Container(
                              width: 120.0,
                              height: 120.0,
                              decoration: BoxDecoration(
                                color: Colors.white24.withOpacity(0.9),
                                borderRadius:
                                    BorderRadius.all(Radius.circular(75.0)),
                                boxShadow: [
                                  BoxShadow(
                                      blurRadius: 8.0, color: Colors.black)
                                ],
                              ),
                              child: Icon(
                                Icons.person,
                                size: 60,
                              ),
                            ),
                            SizedBox(height: 30.0),
                            Observer(
                              builder: (_) => Text(
                                '${userFormStore.user.firstName} ${userFormStore.user.lastName}',
                                style: TextStyle(
                                    fontSize: 30.0,
                                    fontWeight: FontWeight.w400,
                                    fontFamily: 'Montserrat'),
                              ),
                            ),
                            SizedBox(height: 15.0),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.email_outlined,
                                  size: 24,
                                ),
                                SizedBox(
                                  width: 8,
                                ),
                                Observer(
                                  builder: (_) => Text(
                                    '${userFormStore.user.email} ',
                                    style: TextStyle(
                                        fontSize: 16.0,
                                        fontWeight: FontWeight.w400,
                                        fontFamily: 'Montserrat'),
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 10.0),
                            Row(
                              crossAxisAlignment: CrossAxisAlignment.end,
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(
                                  Icons.phone_enabled_outlined,
                                  size: 24,
                                ),
                                SizedBox(
                                  width: 8,
                                ),
                                Observer(
                                  builder: (_) => Text(
                                    '${userFormStore.user.phoneNumber}',
                                    style: TextStyle(
                                        fontSize: 16.0,
                                        fontWeight: FontWeight.w400,
                                        fontFamily: 'Montserrat'),
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(height: 25.0),
                            Text(
                              'Обратная связь',
                              style: TextStyle(
                                  fontSize: 17.0,
                                  color: Color(0xff2e3094),
                                  fontWeight: FontWeight.bold,
                                  fontFamily: 'Montserrat'),
                            ),
                            SizedBox(height: 10.0),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                              children: [
                                Observer(
                                  builder: (_) => IconButton(
                                    icon: const Icon(
                                      MyFlutterApp.local_phone,
                                      size: 40,
                                    ),
                                    color: userFormStore.user.notificationPhone
                                        ? Colors.green
                                        : Colors.grey,
                                    onPressed: () {
                                      setState(() {
                                        userFormStore.setNotification(
                                            'phone',
                                            !userFormStore
                                                .user.notificationPhone);
                                        isEditing = true;
                                      });
                                    },
                                  ),
                                ),
                                Observer(
                                  builder: (_) => IconButton(
                                    icon: const Icon(
                                      MyFlutterApp.telegram_plane,
                                      size: 40,
                                    ),
                                    color:
                                        userFormStore.user.notificationTelegram
                                            ? Colors.blue
                                            : Colors.grey,
                                    onPressed: () {
                                      setState(() {
                                        userFormStore.setNotification(
                                            'telegram',
                                            !userFormStore
                                                .user.notificationTelegram);
                                        isEditing = true;
                                      });
                                    },
                                  ),
                                ),
                                Observer(
                                  builder: (_) => IconButton(
                                    icon: const Icon(
                                      MyFlutterApp.viber,
                                      size: 40,
                                    ),
                                    color: userFormStore.user.notificationViber
                                        ? Colors.purple
                                        : Colors.grey,
                                    onPressed: () {
                                      setState(() {
                                        userFormStore.setNotification(
                                            'viber',
                                            !userFormStore
                                                .user.notificationViber);
                                        isEditing = true;
                                      });
                                    },
                                  ),
                                ),
                              ],
                            ),
                            SizedBox(
                              height: 40,
                            ),
                            Container(
                                height: 40.0,
                                width: 160,
                                child: Material(
                                  borderRadius: BorderRadius.circular(20.0),
                                  color: Color(0xff2e3094).withOpacity(0.8),
                                  elevation: 7.0,
                                  child: TextButton(
                                    onPressed: () {},
                                    child: Center(
                                      child: Text(
                                        'История заказов',
                                        style: TextStyle(
                                            color: Colors.white,
                                            fontFamily: 'Montserrat'),
                                      ),
                                    ),
                                  ),
                                )),
                            SizedBox(height: 20.0),
                            isEditing
                                ? Container(
                                    height: 40.0,
                                    width: 160,
                                    child: Material(
                                      borderRadius: BorderRadius.circular(20.0),
                                      color: Colors.green,
                                      elevation: 7.0,
                                      child: TextButton(
                                        onPressed: () {
                                          save();
                                        },
                                        child: Center(
                                          child: Text(
                                            'Сохранить',
                                            style: TextStyle(
                                                color: Colors.white,
                                                fontFamily: 'Montserrat'),
                                          ),
                                        ),
                                      ),
                                    ))
                                : Container(
                                    height: 40.0,
                                    width: 160,
                                    child: Material(
                                      borderRadius: BorderRadius.circular(20.0),
                                      color: Colors.red,
                                      elevation: 7.0,
                                      child: TextButton(
                                        onPressed: () async {
                                          final prefs = await SharedPreferences
                                              .getInstance();
                                          prefs.clear();
                                          Navigator.pushAndRemoveUntil(
                                            context,
                                            MaterialPageRoute(
                                                builder: (context) => Login()),
                                            (Route<dynamic> route) => false,
                                          );
                                        },
                                        child: Center(
                                          child: Text(
                                            'Выйти',
                                            style: TextStyle(
                                                color: Colors.white,
                                                fontFamily: 'Montserrat'),
                                          ),
                                        ),
                                      ),
                                    ))
                          ],
                        ))
                  ],
                ))));
  }
}

class getClipper extends CustomClipper<Path> {
  @override
  Path getClip(Size size) {
    var path = new Path();

    path.lineTo(0.0, size.height / 2.5);
    path.lineTo(size.width + 50, 0.0);
    path.close();
    return path;
  }

  @override
  bool shouldReclip(CustomClipper<Path> oldClipper) {
    return true;
  }
}




// Widget build(BuildContext context) {
//     return GestureDetector(
//       onTap: unfocus,
//       child: Scaffold(
//         appBar: AppBar(
//           title: Text('Профиль'),
//           centerTitle: true,
//           backgroundColor: Colors.blueAccent,
//         ),
//         body: SafeArea(
//             child: Container(
//           padding: const EdgeInsets.only(left: 20, right: 20, top: 10),
//           child: SingleChildScrollView(
//             child: Column(
//               children: [
//                 Row(
//                   mainAxisAlignment: MainAxisAlignment.center,
//                   children: [
//                     Text('Информация',
//                         style: TextStyle(
//                             fontSize: 24,
//                             color: Colors.black87,
//                             fontWeight: FontWeight.w300)),
//                     Icon(
//                       Icons.article_outlined,
//                       color: Colors.black87,
//                       size: 28,
//                     ),
//                   ],
//                 ),
//                 Form(
//                     key: formKey,
//                     child: Column(
//                       children: [
//                         Observer(
//                           builder: (_) => TextFormField(
//                             keyboardType: TextInputType.name,
//                             decoration: InputDecoration(
//                                 labelText: 'Имя',
//                                 prefixIcon: Icon(
//                                   Icons.person_rounded,
//                                   size: 28,
//                                 ),
//                                 errorText: userFormStore.error.username),
//                             controller: myUserNameController,
//                           ),
//                         ),
//                         SizedBox(height: 10),
//                         Observer(
//                           builder: (_) => TextFormField(
//                             keyboardType: TextInputType.emailAddress,
//                             decoration: InputDecoration(
//                                 labelText: 'Почта',
//                                 prefixIcon: Icon(
//                                   Icons.email,
//                                   size: 28,
//                                 ),
//                                 errorText: userFormStore.error.email),
//                             controller: myUserEmailController,
//                           ),
//                         ),
//                         SizedBox(height: 10),
//                         Observer(
//                           builder: (_) => TextFormField(
//                               controller: myUserPhoneController,
//                               keyboardType: TextInputType.phone,
//                               inputFormatters: [maskNumber],
//                               decoration: InputDecoration(
//                                   labelText: 'Телефон',
//                                   hintText: '+380',
//                                   prefixIcon: Icon(
//                                     Icons.phone_enabled,
//                                     size: 28,
//                                   ),
//                                   errorText: userFormStore.error.numberPhone)),
//                         ),
//                         SizedBox(height: 30),
//                         Row(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Text('Уведомления',
//                                 style: TextStyle(
//                                     fontSize: 24,
//                                     color: Colors.black87,
//                                     fontWeight: FontWeight.w300)),
//                             Icon(
//                               Icons.notifications,
//                               color: Colors.black54,
//                               size: 28,
//                             ),
//                           ],
//                         ),
//                         SizedBox(height: 15),
//                         Observer(
//                           builder: (_) => SwitchListTile(
//                             title: const Text('Telegram',
//                                 style: TextStyle(
//                                     fontSize: 22,
//                                     color: Colors.black,
//                                     fontWeight: FontWeight.w300)),
//                             value: userFormStore.telegram,
//                             key: Key('telegram'),
//                             onChanged: (bool value) =>
//                                 userFormStore.telegram = value,
//                           ),
//                         ),
//                         Observer(
//                           builder: (_) => SwitchListTile(
//                               title: const Text('Телефон',
//                                   style: TextStyle(
//                                       fontSize: 22,
//                                       color: Colors.black,
//                                       fontWeight: FontWeight.w300)),
//                               value: userFormStore.phone,
//                               onChanged: (bool value) =>
//                                   userFormStore.phone = value),
//                         ),
//                         Observer(
//                           builder: (_) => SwitchListTile(
//                             title: const Text('Viber',
//                                 style: TextStyle(
//                                     fontSize: 22,
//                                     color: Colors.black,
//                                     fontWeight: FontWeight.w300)),
//                             value: userFormStore.viber,
//                             onChanged: (bool value) =>
//                                 userFormStore.viber = value,
//                           ),
//                         ),
//                         SizedBox(height: 20),
//                         Container(
//                           width: MediaQuery.of(context).size.width * 0.62,
//                           child: OutlinedButton(
//                             style: OutlinedButton.styleFrom(
//                                 backgroundColor: Colors.green[300],
//                                 padding: EdgeInsets.only(
//                                     left: 34, right: 34, top: 12, bottom: 12)),
//                             onPressed: () async {
//                               userFormStore.validateAll();
//                               if (userFormStore.error.hasErrors) return;
//                               setData();
//                               Navigator.pop(context);
//                               Flushbar(
//                                 flushbarPosition: FlushbarPosition.TOP,
//                                 message: 'Профиль успешно сохранен',
//                                 duration: Duration(seconds: 3),
//                                 messageSize: 17,
//                                 backgroundColor: Colors.green,
//                               ).show(context);
//                             },
//                             child: Text(
//                               'Сохранить',
//                               style: TextStyle(
//                                   color: Colors.white,
//                                   fontSize: 19,
//                                   fontWeight: FontWeight.w300),
//                             ),
//                           ),
//                         ),
//                         Container(
//                           width: MediaQuery.of(context).size.width * 0.62,
//                           child: OutlinedButton(
//                             style: OutlinedButton.styleFrom(
//                                 backgroundColor: Colors.red[700],
//                                 padding: EdgeInsets.only(
//                                     left: 34, right: 34, top: 12, bottom: 12)),
//                             onPressed: () async {

//                               final prefs = await SharedPreferences.getInstance();

//                               prefs.clear();
//                               Navigator.pushAndRemoveUntil(
//                                 context,
//                                 MaterialPageRoute(
//                                     builder: (context) => Login()),
//                                 (Route<dynamic> route) => false,
//                               );
//                             },
//                             child: Text(
//                               'Выйти',
//                               style: TextStyle(
//                                   color: Colors.white,
//                                   fontSize: 19,
//                                   fontWeight: FontWeight.w300),
//                             ),
//                           ),
//                         ),
//                       ],
//                     ))
//               ],
//             ),
//           ),
//         )),
//       ),
//     );
//   }