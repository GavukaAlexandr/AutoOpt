import 'dart:convert';
import 'dart:developer';

import 'package:avto_opt/debounce.dart';
import 'package:dio/dio.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:loading_overlay/loading_overlay.dart';
import 'package:percent_indicator/percent_indicator.dart';
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

  TextEditingController phoneController = TextEditingController();
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

  initState() {
    super.initState();
    isToken();
    _controllerSuccess = AnimationController(
        duration: const Duration(milliseconds: 800), vsync: this, value: 0);
    _animationSuccess = CurvedAnimation(
        parent: _controllerSuccess, curve: Curves.fastOutSlowIn);
    _controllerRegister = AnimationController(
        duration: const Duration(milliseconds: 800), vsync: this, value: 0);
    _animationRegister = CurvedAnimation(
        parent: _controllerRegister, curve: Curves.fastOutSlowIn);
  }

  isNumberValid(number) {
    String pattern = r'^(?:[+0][1-9])?[0-9]{11,12}$';
    RegExp regExp = new RegExp(pattern);
    return regExp.hasMatch(number);
  }

  @override
  dispose() {
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
        //! redirect!
      } on FirebaseAuthException catch (e) {
        print('ERRORRR ${e.message}');
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
        //! redirect!
      } on FirebaseAuthException catch (e) {
        print('ERRORRR ${e.message}');
        setState(() {
          loaderStatusOtp = false;
        });
      }
    }
  }

  isToken() {
    //if token exist => isExpiredToken() if false => login if yes => refreshToken()
  }

  isExpiredToken() {
    //check if token expired if yes => refreshToken() if no return false
  }

  refreshToken() {
    //refresh and login()
  }

  isNumberExist(number) async {
    try {
      var response = await Dio().post("http://192.168.88.30:3000/user/is-exist",
          data: {"phoneNumber": number.toString()});
      var result = response.data;

      return result['isUserExist'];
    } catch (e) {
      return false;
    }
  }

  login() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      var response =
          await Dio().post("http://192.168.88.30:3000/auth/login", data: {
        "phoneNumber": prefs.getString('phone').toString(),
        "firebaseUid": prefs.getString('user-uid').toString()
      });
      var result = response.data;
      prefs.setString('token', result['access_token']);
      log("THERE WILL BE REDIRECT");
      Navigator.pushNamed(context, 'order');
    } catch (e) {
      print(e);
    }
  }

  register() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      var response =
          await Dio().post("http://192.168.88.30:3000/user/register", data: {
        "firstName": prefs.getString('first-name'),
        "lastName": prefs.getString('last-name'),
        "email": prefs.getString('email'),
        "phoneNumber": prefs.getString('phone'),
        "firebaseUid": prefs.getString('user-uid')
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
        currentStateRegisterFields = RegisterFields.HIDE_REGISTER_FIELDS;
      });
    }

    if (await isNumberExist(number)) {
      print('send sms');
      _controllerRegister.reverse();
      _controllerSuccess.forward();
      return setState(() {
        currentStateRegisterFields = RegisterFields.HIDE_REGISTER_FIELDS;
      });
    }

    if (!await isNumberExist(number)) {
      return setState(() {
        _controllerSuccess.reverse();
        _controllerRegister.forward();
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
          print(phoneVerificationFailed.message);
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
    return Column(
      children: [
        Container(
          padding: EdgeInsets.only(bottom: 10.0),
          child: TextFormField(
              keyboardType: TextInputType.emailAddress,
              autofocus: false,
              controller: firstNameController,
              decoration: InputDecoration(
                labelText: 'Имя',
                contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0)),
              )),
        ),
        Container(
          padding: EdgeInsets.only(bottom: 10.0),
          child: TextFormField(
              keyboardType: TextInputType.emailAddress,
              autofocus: false,
              controller: lastNameController,
              decoration: InputDecoration(
                labelText: 'Фамилия',
                contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0)),
              )),
        ),
        Container(
          padding: EdgeInsets.only(bottom: 10.0),
          child: TextFormField(
              keyboardType: TextInputType.emailAddress,
              autofocus: false,
              controller: emailController,
              decoration: InputDecoration(
                labelText: 'Почта',
                contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(32.0)),
              )),
        ),
        Padding(
          padding: EdgeInsets.symmetric(vertical: 1.0),
          child: RaisedButton(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            onPressed: () {
              prepareRegister();
            },
            padding: EdgeInsets.all(12),
            color: Colors.lightBlueAccent,
            child: Text('Зарегестрироваться',
                style: TextStyle(color: Colors.white)),
          ),
        )
      ],
    );
  }

  getMobileFormWidget(context) {
    return LoadingOverlay(
        color: Colors.black54,
        isLoading: loaderStatusForm,
        child: Form(
            key: formGlobalKey,
            child: ListView(
              shrinkWrap: true,
              padding: EdgeInsets.only(left: 24.0, right: 24.0),
              children: [
                Hero(
                    tag: 'logo',
                    child: CircleAvatar(
                      backgroundColor: Colors.transparent,
                      radius: 50.0,
                      child: Image.asset('assets/logo.png'),
                    )),
                Container(
                    alignment: Alignment.center,
                    child: Text(
                      'AUTO OPT',
                      style: TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.w400,
                          fontSize: 30),
                    )),
                SizedBox(height: 20.0),
                Container(
                  padding: EdgeInsets.only(bottom: 10.0),
                  child: TextFormField(
                    maxLength: 13,
                    validator: (number) {
                      if (isNumberValid(number))
                        return null;
                      else {
                        return 'неверный телефон';
                      }
                    },
                    onChanged: (String number) {
                      if (!isNumberValid(number)) {
                        formGlobalKey.currentState!.validate();
                        _controllerRegister.reverse();
                        _controllerSuccess.reverse();
                        return setState(() {
                          currentStateRegisterFields =
                              RegisterFields.HIDE_REGISTER_FIELDS;
                        });
                      }
                      if (number == '') {
                        _controllerRegister.reverse();
                        _controllerSuccess.reverse();
                        return setState(() {
                          currentStateRegisterFields =
                              RegisterFields.HIDE_REGISTER_FIELDS;
                        });
                      }
                      if (isNumberValid(number)) {
                        formGlobalKey.currentState!.validate();
                        _debouncer.run(() => prepareFields(number));
                      }
                    },
                    controller: phoneController,
                    decoration: InputDecoration(
                      counterText: "",
                      contentPadding:
                          EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(32.0)),
                      labelText: 'Номер телефона',
                    ),
                  ),
                ),
                if (currentStateRegisterFields ==
                    RegisterFields.SHOW_REGISTER_FIELDS)
                  ScaleTransition(
                      scale: _animationRegister,
                      alignment: Alignment.center,
                      child: getRegisterFields(context)),
                if (currentStateRegisterFields ==
                    RegisterFields.HIDE_REGISTER_FIELDS)
                  ScaleTransition(
                      scale: _animationSuccess,
                      alignment: Alignment.center,
                      child: Padding(
                        padding: EdgeInsets.symmetric(vertical: 1.0),
                        child: RaisedButton(
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(20),
                          ),
                          onPressed: () async {
                            final prefs = await SharedPreferences.getInstance();
                            prefs.setString('phone', phoneController.text);
                            setState(() {
                              loaderStatusForm = true;
                            });

                            await _auth.verifyPhoneNumber(
                                phoneNumber: phoneController.text,
                                verificationCompleted:
                                    (phoneAuthCredential) async {
                                  setState(() {
                                    loaderStatusForm = false;
                                  });
                                },
                                verificationFailed:
                                    (phoneVerificationFailed) async {
                                  setState(() {
                                    loaderStatusForm = false;
                                  });
                                  print(phoneVerificationFailed.message);
                                },
                                codeSent:
                                    (verificationId, resendingToken) async {
                                  setState(() {
                                    currentState = MobileVereficationState
                                        .SHOW_OTP_FORM_STATE;
                                    this.verificationId = verificationId;
                                    loaderStatusForm = false;
                                  });
                                },
                                codeAutoRetrievalTimeout:
                                    (vereficationId) async {});
                          },
                          padding: EdgeInsets.all(12),
                          color: Colors.lightBlueAccent,
                          child: Text('Отправить код',
                              style: TextStyle(color: Colors.white)),
                        ),
                      )),
              ],
            )));
  }

  getOtpFormWidget(context) {
    return LoadingOverlay(
        color: Colors.black54,
        isLoading: loaderStatusOtp,
        child: ListView(
          shrinkWrap: true,
          padding: EdgeInsets.only(left: 24.0, right: 24.0),
          children: [
            Hero(
                tag: 'logo',
                child: CircleAvatar(
                  backgroundColor: Colors.transparent,
                  radius: 50.0,
                  child: Image.asset('assets/logo.png'),
                )),
            Container(
                alignment: Alignment.center,
                child: Text(
                  'AUTO OPT',
                  style: TextStyle(
                      color: Colors.blue,
                      fontWeight: FontWeight.w400,
                      fontSize: 30),
                )),
            SizedBox(height: 20.0),
            Container(
              padding: EdgeInsets.only(bottom: 10.0),
              child: TextFormField(
                  keyboardType: TextInputType.emailAddress,
                  autofocus: false,
                  controller: otpController,
                  decoration: InputDecoration(
                    labelText: 'Код подтверждения',
                    contentPadding: EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                    border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(32.0)),
                  )),
            ),
            Padding(
              padding: EdgeInsets.symmetric(vertical: 1.0),
              child: RaisedButton(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(20),
                ),
                onPressed: () async {
                  PhoneAuthCredential phoneAuthCredential =
                      PhoneAuthProvider.credential(
                          verificationId: verificationId,
                          smsCode: otpController.text);
                  signInWithPhoneAuthCredentional(phoneAuthCredential);
                },
                padding: EdgeInsets.all(12),
                color: Colors.lightBlueAccent,
                child:
                    Text('Продолжить', style: TextStyle(color: Colors.white)),
              ),
            ),
            SizedBox(height: 24.0),
            Text(
              'Введите код подтверждения который мы отправили вам на телефон',
              textAlign: TextAlign.center,
              style: TextStyle(color: Colors.black54),
            ),
          ],
        ));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Colors.white,
        body: Container(
            decoration: BoxDecoration(
                // image: DecorationImage(image: AssetImage('assets/bg-1.jpg'), fit: BoxFit.cover)
                ),
            child: Center(
                child: currentState ==
                        MobileVereficationState.SHOW_MOBILE_FORM_STATE
                    ? getMobileFormWidget(context)
                    : getOtpFormWidget(context))));
  }
}
