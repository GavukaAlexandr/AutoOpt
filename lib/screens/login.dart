import 'dart:convert';
import 'dart:developer';

import 'package:avto_opt/api_client/api_client.dart';
import 'package:avto_opt/api_client/endpoints/login_endpoint.dart';
import 'package:avto_opt/debounce.dart';
import 'package:avto_opt/my_flutter_app_icons.dart';
import 'package:avto_opt/screens/orderCarParts.dart';
import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:loading_indicator/loading_indicator.dart';
import 'package:shared_preferences/shared_preferences.dart';

enum MobileVereficationState { SHOW_MOBILE_FORM_STATE, SHOW_OTP_FORM_STATE }
enum RegisterFields { SHOW_REGISTER_FIELDS, HIDE_REGISTER_FIELDS }

class Login extends StatefulWidget {
  @override
  _Login createState() => _Login();
}

class _Login extends State<Login> with TickerProviderStateMixin {
  MobileVereficationState currentState =
      MobileVereficationState.SHOW_MOBILE_FORM_STATE;

  RegisterFields currentStateRegisterFields =
      RegisterFields.HIDE_REGISTER_FIELDS;

  TextEditingController phoneController = TextEditingController(text: '+380');
  TextEditingController firstNameController = TextEditingController();
  TextEditingController lastNameController = TextEditingController();

  TextEditingController emailController = TextEditingController();
  TextEditingController otpController = TextEditingController();

  FirebaseAuth _auth = FirebaseAuth.instance;
  late String verificationId;
  final _debouncer = Debouncer(milliseconds: 300);
  late AnimationController _controllerSuccess;
  late Animation<double> _animationSuccess;
  late AnimationController _controllerRegister;
  late Animation<double> _animationRegister;
  bool loaderStatusOtp = false;
  bool loaderStatusForm = false;
  final formGlobalKey = GlobalKey<FormState>();
  final registerGlobalKey = GlobalKey<FormState>();
  late AnimationController controller;
  bool isLoginText = true;
  var currentFocus;
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey();

  Map notifications = {
    'telegram': false,
    'viber': false,
    'phone': false,
  };

  unfocus() {
    currentFocus = FocusScope.of(context);
    if (!currentFocus.hasPrimaryFocus) {
      currentFocus.unfocus();
    }
  }

  initState() {
    super.initState();
    phoneController
      ..selection = TextSelection.fromPosition(
          TextPosition(offset: phoneController.text.length));
    controller = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 1),
    )..addListener(() {
        setState(() {});
      });
    controller.repeat(reverse: true);

    _controllerSuccess = AnimationController(
        duration: const Duration(milliseconds: 400), vsync: this, value: 0);
    _animationSuccess = CurvedAnimation(
        parent: _controllerSuccess, curve: Curves.fastOutSlowIn);
    _controllerRegister = AnimationController(
        duration: const Duration(milliseconds: 400), vsync: this, value: 0);
    _animationRegister = CurvedAnimation(
        parent: _controllerRegister, curve: Curves.fastOutSlowIn);
  }

  isNumberValid(number) {
    String pattern = r'^(?:[+0][1-9])?[0-9]{11,12}$';
    RegExp regExp = new RegExp(pattern);
    return regExp.hasMatch(number);
  }

  isEmailValid(email) {
    String pattern =
        r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+";
    RegExp regExp = new RegExp(pattern);
    return regExp.hasMatch(email);
  }

  @override
  dispose() {
    controller.dispose();
    _controllerSuccess.dispose();
    _controllerRegister.dispose();
    super.dispose();
  }

  void signInWithPhoneAuthCredentional(
      PhoneAuthCredential phoneAuthCredential) async {
    final prefs = await SharedPreferences.getInstance();

    setState(() {
      loaderStatusOtp = true;
    });

    if (!await isNumberExist(prefs.getString('phone'))) {
      try {
        final authCredential =
            await _auth.signInWithCredential(phoneAuthCredential);
        if (authCredential.user != null)
          prefs.setString('user-uid', authCredential.user!.uid);
        register();
        setState(() {
          loaderStatusOtp = false;
        });
      } on FirebaseAuthException catch (e) {
        _scaffoldKey.currentState!.showSnackBar(SnackBar(
          content: Text(
              'Код подтверждения sms недействителен. Пожалуйста, повторно отправьте смс с кодом подтверждения и обязательно используйте правильный код подтверждения'),
          duration: Duration(milliseconds: 6000),
          backgroundColor: Colors.redAccent,
        ));

        setState(() {
          loaderStatusOtp = false;
        });
      }
    }

    if (await isNumberExist(prefs.getString('phone'))) {
      try {
        final authCredential =
            await _auth.signInWithCredential(phoneAuthCredential);
        if (authCredential.user != null)
          prefs.setString('user-uid', authCredential.user!.uid);
        login();
        setState(() {
          loaderStatusOtp = false;
        });
      } on FirebaseAuthException catch (e) {
        _scaffoldKey.currentState!.showSnackBar(SnackBar(
          content: Text(
              'Код подтверждения sms недействителен. Пожалуйста, повторно отправьте смс с кодом и обязательно используйте правильный код подтверждения'),
          duration: Duration(milliseconds: 7500),
          backgroundColor: Colors.redAccent,
        ));
        setState(() {
          loaderStatusOtp = false;
        });
      }
    }
  }

  isNumberExist(number) async {
    try {
      var response = await Dio().post(
          "https://auto-opt.cyber-geeks-lab.synology.me/user/is-exist",
          data: {"phoneNumber": number.toString()});
      var result = response.data;

      return result['isUserExist'];
    } catch (e) {
      return false;
    }
  }

  login() async {
    Client _client = new Client();
    final prefs = await SharedPreferences.getInstance();
    var _endpointProvider = new EndpointLoginProvider(_client.init());
    var data = await _endpointProvider.login();
    prefs.setString('token', data['access_token']);
      prefs.remove('firstName');
      prefs.remove('lastName');
      prefs.remove('email');
      prefs.remove('firebaseUid');
      prefs.remove('telegramNotification');
      prefs.remove('viberNotification');
      prefs.remove('phoneNotification');
    return Navigator.pushAndRemoveUntil(
        context,
        MaterialPageRoute(builder: (context) => OrderCarParts()),
        (Route<dynamic> route) => false,
      );
  }

  register() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      var response = await Dio().post(
          "https://auto-opt.cyber-geeks-lab.synology.me/user/register",
          data: {
            "firstName": prefs.getString('first-name'),
            "lastName": prefs.getString('last-name'),
            "email": prefs.getString('email'),
            "phoneNumber": prefs.getString('phone'),
            "firebaseUid": prefs.getString('user-uid'),
            "telegramNotification": prefs.getBool('notif-telegram'),
            "viberNotification": prefs.getBool('notif-viber'),
            "phoneNotification": prefs.getBool('notif-phone')
          });
      login();
    } catch (e) {
      print(e);
    }
  }

  prepareFields(String number) async {
    if (number == '') {
      _controllerRegister.reverse();
      _controllerSuccess.reverse();
      return setState(() {
        isLoginText = true;
        currentStateRegisterFields = RegisterFields.HIDE_REGISTER_FIELDS;
      });
    }

    if (await isNumberExist(number)) {
      unfocus();
      _controllerRegister.reverse();
      _controllerSuccess.forward();
      return setState(() {
        isLoginText = false;
        currentStateRegisterFields = RegisterFields.HIDE_REGISTER_FIELDS;
      });
    }

    if (!await isNumberExist(number)) {
      unfocus();
      return setState(() {
        _controllerSuccess.reverse();
        _controllerRegister.forward();
        isLoginText = false;
        currentStateRegisterFields = RegisterFields.SHOW_REGISTER_FIELDS;
      });
    }
  }

  prepareRegister() async {
    setState(() {
      loaderStatusForm = true;
    });
    final prefs = await SharedPreferences.getInstance();
    prefs.setString('phone', phoneController.text);
    prefs.setString('email', emailController.text);
    prefs.setString('first-name', firstNameController.text);
    prefs.setString('last-name', lastNameController.text);
    sendSms();
  }

  sendSms() async {
    await _auth.verifyPhoneNumber(
        phoneNumber: phoneController.text,
        verificationCompleted: (phoneAuthCredential) async {
          setState(() {
            loaderStatusForm = false;
          });
        },
        verificationFailed: (phoneVerificationFailed) async {
          setState(() {
            loaderStatusForm = false;
          });
          _scaffoldKey.currentState!.showSnackBar(SnackBar(
            content: Text(
                'Неправильный формат номера телефона. Пожалуйста, введите номер телефона в правильном формате'),
            duration: Duration(milliseconds: 6000),
            backgroundColor: Colors.redAccent,
          ));
        },
        codeSent: (verificationId, resendingToken) async {
          setState(() {
            currentState = MobileVereficationState.SHOW_OTP_FORM_STATE;
            this.verificationId = verificationId;
            loaderStatusForm = true;
          });
        },
        codeAutoRetrievalTimeout: (vereficationId) async {});
  }

  getRegisterFields(context) {
    return ScaleTransition(
        scale: _animationRegister,
        alignment: Alignment.center,
        child: Form(
          key: registerGlobalKey,
          child: Column(
            children: [
              Container(
                padding: EdgeInsets.only(bottom: 10.0),
                child: TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    autofocus: false,
                    controller: firstNameController,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                    ),
                    validator: (firstName) {
                      if (firstName == null || firstName.isEmpty) {
                        return 'Введите имя';
                      }
                    },
                    onChanged: (fistName) {
                      if (fistName != '')
                        registerGlobalKey.currentState!.validate();
                    },
                    decoration: InputDecoration(
                      labelText: 'Имя',
                      contentPadding:
                          EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(
                            color: Colors.white,
                          )),
                      enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(color: Colors.white)),
                      focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(color: Colors.white)),
                      labelStyle: TextStyle(color: Colors.white70),
                    )),
              ),
              Container(
                padding: EdgeInsets.only(bottom: 10.0),
                child: TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    autofocus: false,
                    controller: lastNameController,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                    ),
                    validator: (lastName) {
                      if (lastName == null || lastName.isEmpty) {
                        return 'Введите фамилию';
                      }
                    },
                    onChanged: (lastName) {
                      if (lastName != '')
                        registerGlobalKey.currentState!.validate();
                    },
                    decoration: InputDecoration(
                      labelText: 'Фамилия',
                      contentPadding:
                          EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(
                            color: Colors.white,
                          )),
                      enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(color: Colors.white)),
                      focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(color: Colors.white)),
                      labelStyle: TextStyle(color: Colors.white70),
                    )),
              ),
              Container(
                padding: EdgeInsets.only(bottom: 10.0),
                child: TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    autofocus: false,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15,
                    ),
                    controller: emailController,
                    validator: (email) {
                      if (isEmailValid(email))
                        return null;
                      else {
                        return 'неверный электронный адрес';
                      }
                    },
                    onChanged: (email) {
                      if (email != '')
                        registerGlobalKey.currentState!.validate();
                    },
                    decoration: InputDecoration(
                      labelText: 'Почта',
                      contentPadding:
                          EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(
                            color: Colors.white,
                          )),
                      enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(color: Colors.white)),
                      focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0),
                          borderSide: BorderSide(color: Colors.white)),
                      labelStyle: TextStyle(color: Colors.white70),
                    )),
              ),
              Container(
                width: double.infinity,
                child: RaisedButton(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  onPressed: () {
                    if (registerGlobalKey.currentState!.validate()) {
                      showDialog<String>(
                          context: context,
                          builder: (BuildContext context) {
                            return StatefulBuilder(
                                builder: (context, setState) {
                              return AlertDialog(
                                shape: const RoundedRectangleBorder(
                                    borderRadius: BorderRadius.all(
                                        Radius.circular(20.0))),
                                title: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.notifications,
                                        color: Colors.blueAccent, size: 40),
                                    SizedBox(
                                      height: 5,
                                    ),
                                    Text(
                                      'Обратная связь',
                                      style: TextStyle(
                                          color: Colors.black87, fontSize: 18),
                                    )
                                  ],
                                ),
                                content: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Row(
                                      mainAxisAlignment:
                                          MainAxisAlignment.spaceBetween,
                                      children: [
                                        IconButton(
                                          icon: const Icon(
                                            MyFlutterApp.local_phone,
                                            size: 35,
                                          ),
                                          color: notifications['phone']
                                              ? Colors.green
                                              : Colors.black45,
                                          onPressed: () {
                                            setState(() {
                                              notifications['phone'] =
                                                  !notifications['phone'];
                                            });
                                          },
                                        ),
                                        IconButton(
                                          icon: const Icon(
                                            MyFlutterApp.telegram_plane,
                                            size: 35,
                                          ),
                                          color: notifications['telegram']
                                              ? Colors.blue
                                              : Colors.black45,
                                          onPressed: () {
                                            setState(() {
                                              notifications['telegram'] =
                                                  !notifications['telegram'];
                                            });
                                          },
                                        ),
                                        IconButton(
                                          icon: const Icon(
                                            MyFlutterApp.viber,
                                            size: 35,
                                          ),
                                          color: notifications['viber']
                                              ? Colors.purple
                                              : Colors.black45,
                                          onPressed: () {
                                            setState(() {
                                              notifications['viber'] =
                                                  !notifications['viber'];
                                            });
                                          },
                                        ),
                                      ],
                                    ),
                                  ],
                                ),
                                actions: <Widget>[
                                  TextButton(
                                    onPressed:
                                        notifications.values.contains(true)
                                            ? () async {
                                                final prefs =
                                                    await SharedPreferences
                                                        .getInstance();
                                                prefs.setBool('notif-viber',
                                                    notifications['viber']);
                                                prefs.setBool('notif-telegram',
                                                    notifications['telegram']);
                                                prefs.setBool('notif-phone',
                                                    notifications['phone']);
                                                Navigator.pop(context);
                                                return prepareRegister();
                                              }
                                            : null,
                                    child: const Text(
                                      'Продолжить',
                                      style: TextStyle(fontSize: 16),
                                    ),
                                  ),
                                ],
                              );
                            });
                          });
                    } else {
                      registerGlobalKey.currentState!.validate();
                    }
                  },
                  padding: EdgeInsets.all(12),
                  color: Color(0xff1573B4),
                  child: Text('Зарегестрироваться',
                      style: TextStyle(color: Colors.white)),
                ),
              ),
              Text(
                'текущий пользователь не найден зарегестрируйтесь пожалуйста',
                textAlign: TextAlign.center,
                style: TextStyle(color: Colors.white54),
              ),
            ],
          ),
        ));
  }

  getMobileFormWidget(context) {
    return Form(
      key: formGlobalKey,
      child: Column(
        children: [
          Hero(
              tag: 'logo',
              child: CircleAvatar(
                backgroundColor: Colors.transparent,
                radius: currentStateRegisterFields ==
                        RegisterFields.HIDE_REGISTER_FIELDS
                    ? 100.0
                    : 75.0,
                child: Image.asset('assets/bg-1.png'),
              )),
          Container(
            padding: EdgeInsets.only(bottom: 10.0),
            child: TextFormField(
              validator: (number) {
                if (isNumberValid(number) || number == '')
                  return null;
                else {
                  return 'неверный телефон';
                }
              },
              onChanged: (String number) {
                if (number == '') {
                  formGlobalKey.currentState!.validate();
                  _controllerRegister.reverse();
                  _controllerSuccess.reverse();
                  return setState(() {
                    isLoginText = true;
                    currentStateRegisterFields =
                        RegisterFields.HIDE_REGISTER_FIELDS;
                  });
                }
                if (isNumberValid(number)) {
                  formGlobalKey.currentState!.validate();
                  controller.forward();
                  _debouncer.run(() => prepareFields(number));
                }
                if (!isNumberValid(number) || number.length < 13) {
                  _controllerSuccess.reverse();
                  _controllerRegister.reverse();
                  _controllerSuccess.reverse();
                  return setState(() {
                    isLoginText = true;
                    currentStateRegisterFields =
                        RegisterFields.HIDE_REGISTER_FIELDS;
                  });
                }
              },
              controller: phoneController,
              style: TextStyle(
                color: Colors.white,
                fontSize: 15,
              ),
              decoration: InputDecoration(
                contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0),
                    borderSide: BorderSide(
                      color: Colors.white,
                    )),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0),
                    borderSide: BorderSide(color: Colors.white)),
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0),
                    borderSide: BorderSide(color: Colors.white)),
                focusedErrorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0),
                    borderSide: BorderSide(
                      color: Color(0xffEC1C24),
                    )),
                errorStyle: TextStyle(color: Color(0xffEC1C24), fontSize: 16),
                labelStyle: TextStyle(color: Colors.white70, fontSize: 17),
                hintStyle: TextStyle(color: Colors.white),
                labelText: 'Номер телефона',
              ),
            ),
          ),
          if (isLoginText)
            Column(
              children: [
                SizedBox(
                  height: 10,
                ),
                Text(
                  'Введите номер телефона чтобы войти',
                  style: TextStyle(color: Colors.white54),
                ),
                SizedBox(
                  height: 10,
                ),
                Text('Пример: +380 ( ## ) ### - ## - ##',
                    style: TextStyle(color: Colors.white60))
              ],
            ),
          if (currentStateRegisterFields == RegisterFields.SHOW_REGISTER_FIELDS)
            getRegisterFields(context),
          if (currentStateRegisterFields == RegisterFields.HIDE_REGISTER_FIELDS)
            ScaleTransition(
                scale: _animationSuccess,
                alignment: Alignment.center,
                child: Container(
                  padding: EdgeInsets.symmetric(vertical: 5.0),
                  width: double.infinity,
                  child: RaisedButton(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20),
                    ),
                    onPressed: () async {
                      unfocus();
                      final prefs = await SharedPreferences.getInstance();
                      prefs.setString('phone', phoneController.text);
                      setState(() {
                        loaderStatusForm = true;
                      });
                      await _auth.verifyPhoneNumber(
                          phoneNumber: phoneController.text,
                          verificationCompleted: (phoneAuthCredential) async {
                            setState(() {
                              loaderStatusForm = false;
                            });
                          },
                          verificationFailed: (phoneVerificationFailed) async {
                            setState(() {
                              loaderStatusForm = false;
                            });
                            print(phoneVerificationFailed.message);
                          },
                          codeSent: (verificationId, resendingToken) async {
                            setState(() {
                              currentState =
                                  MobileVereficationState.SHOW_OTP_FORM_STATE;
                              this.verificationId = verificationId;
                              loaderStatusForm = false;
                            });
                          },
                          codeAutoRetrievalTimeout: (vereficationId) async {});
                    },
                    padding: EdgeInsets.all(12),
                    color: Color(0xff1573B4),
                    child: Text('Отправить код',
                        style: TextStyle(color: Colors.white)),
                  ),
                )),
          if (loaderStatusForm)
            Container(
              width: 40,
              height: 40,
              child: LoadingIndicator(
                  indicatorType: Indicator.ballPulse,
                  colors: const [Colors.white70],
                  strokeWidth: 1,
                  backgroundColor: Colors.transparent,
                  pathBackgroundColor: Colors.transparent),
            )
        ],
      ),
    );
  }

  getOtpFormWidget(context) {
    return Column(
      children: [
        Hero(
            tag: 'logo',
            child: CircleAvatar(
              backgroundColor: Colors.transparent,
              radius: 100.0,
              child: Image.asset('assets/bg-1.png'),
            )),
        Container(
          padding: EdgeInsets.only(bottom: 10.0),
          child: TextFormField(
              style: TextStyle(
                color: Colors.white,
                fontSize: 15,
              ),
              keyboardType: TextInputType.emailAddress,
              autofocus: false,
              controller: otpController,
              decoration: InputDecoration(
                labelText: 'Код подтверждения',
                contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0),
                    borderSide: BorderSide(
                      color: Colors.white,
                    )),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0),
                    borderSide: BorderSide(color: Colors.white)),
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0),
                    borderSide: BorderSide(color: Colors.white)),
                labelStyle: TextStyle(color: Colors.white70, fontSize: 17),
              )),
        ),
        Container(
          width: double.infinity,
          padding: EdgeInsets.symmetric(vertical: 1.0),
          child: RaisedButton(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            onPressed: () async {
              unfocus();
              PhoneAuthCredential phoneAuthCredential =
                  PhoneAuthProvider.credential(
                      verificationId: verificationId,
                      smsCode: otpController.text);
              signInWithPhoneAuthCredentional(phoneAuthCredential);
            },
            padding: EdgeInsets.all(12),
            color: Color(0xff1573B4),
            child: Text('Продолжить', style: TextStyle(color: Colors.white)),
          ),
        ),
        SizedBox(height: 24.0),
        Text(
          'Введите код подтверждения который мы отправили вам на телефон',
          textAlign: TextAlign.center,
          style: TextStyle(color: Colors.white54),
        ),
        if (loaderStatusOtp)
          Container(
            width: 40,
            height: 40,
            child: LoadingIndicator(
                indicatorType: Indicator.ballPulse,
                colors: const [Colors.white70],
                strokeWidth: 1,
                backgroundColor: Colors.transparent,
                pathBackgroundColor: Colors.transparent),
          )
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: unfocus,
      child: Scaffold(
        key: _scaffoldKey,
        backgroundColor: Color(0xff2e3094),
        body: Center(
          child: ListView(
            padding: EdgeInsets.only(left: 24.0, right: 24.0),
            shrinkWrap: true,
            children: [
              currentState == MobileVereficationState.SHOW_MOBILE_FORM_STATE
                  ? getMobileFormWidget(context)
                  : getOtpFormWidget(context),
            ],
          ),
        ),
      ),
    );
  }
}
