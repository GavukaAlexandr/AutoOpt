import 'package:avto_opt/api_client/api_client.dart';
import 'package:avto_opt/api_client/endpoints/login_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/number_exist_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/register_endpoint.dart';
import 'package:avto_opt/debounce.dart';
import 'package:avto_opt/my_flutter_app_icons.dart';
import 'package:avto_opt/screens/order_car_parts.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:loading_indicator/loading_indicator.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:easy_localization/easy_localization.dart';

enum MobileVereficationState { SHOW_MOBILE_FORM_STATE, SHOW_OTP_FORM_STATE }
enum RegisterFields { SHOW_REGISTER_FIELDS, HIDE_REGISTER_FIELDS }

class Login extends StatefulWidget {
  const Login({Key? key}) : super(key: key);

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

  final FirebaseAuth _auth = FirebaseAuth.instance;
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
  final Client _client = Client();
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

  @override
  initState() {
    super.initState();
    phoneController.selection = TextSelection.fromPosition(
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
    RegExp regExp = RegExp(pattern);
    return regExp.hasMatch(number);
  }

  isEmailValid(email) {
    String pattern =
        r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+";
    RegExp regExp = RegExp(pattern);
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
        if (authCredential.user != null) {
          prefs.setString('user-uid', authCredential.user!.uid);
        }
        register();
        setState(() {
          loaderStatusOtp = false;
        });
      } on FirebaseAuthException catch (e) {
        _scaffoldKey.currentState!.showSnackBar(SnackBar(
          content: Text('error_sms'.tr()),
          duration: const Duration(milliseconds: 6000),
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
        if (authCredential.user != null) {
          prefs.setString('user-uid', authCredential.user!.uid);
        }
        login();
        setState(() {
          loaderStatusOtp = false;
        });
      } on FirebaseAuthException catch (e) {
        _scaffoldKey.currentState!.showSnackBar(SnackBar(
          content: Text('error_sms'.tr()),
          duration: const Duration(milliseconds: 7500),
          backgroundColor: Colors.redAccent,
        ));
        setState(() {
          loaderStatusOtp = false;
        });
      }
    }
  }

  Future<bool> isNumberExist(number) async {
    var _endpointProvider = EndpointNumberExistProvider(_client.init());
    bool result = await _endpointProvider.isNumberExist(number);
    return result;
  }

  login() async {
    final prefs = await SharedPreferences.getInstance();
    var _endpointProvider = EndpointLoginProvider(_client.init());
    await _endpointProvider.login();
    prefs.remove('firstName');
    prefs.remove('lastName');
    prefs.remove('email');
    prefs.remove('telegramNotification');
    prefs.remove('viberNotification');
    prefs.remove('phoneNotification');
    return Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => const OrderCarParts()),
      (Route<dynamic> route) => false,
    );
  }

  register() async {
    final prefs = await SharedPreferences.getInstance();
    var _endpointProvider = EndpointRegisterProvider(_client.init());
    var preparedRegisterData = {
      "firstName": prefs.getString('first-name'),
      "lastName": prefs.getString('last-name'),
      "email": prefs.getString('email'),
      "phoneNumber": prefs.getString('phone'),
      "firebaseUid": prefs.getString('user-uid'),
      "telegramNotification": prefs.getBool('notif-telegram'),
      "viberNotification": prefs.getBool('notif-viber'),
      "phoneNotification": prefs.getBool('notif-phone')
    };
    var status = await _endpointProvider.register(preparedRegisterData);
    if (status == 201) {
      return login();
    } else {
      setState(() {
        otpController.text = '';
        currentState = MobileVereficationState.SHOW_MOBILE_FORM_STATE;
        currentStateRegisterFields = RegisterFields.SHOW_REGISTER_FIELDS;
        loaderStatusForm = false;
      });
      _scaffoldKey.currentState!.showSnackBar(SnackBar(
        content: Text('email_exist'.tr()),
        duration: const Duration(seconds: 30),
        backgroundColor: Colors.redAccent,
      ));
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
            content: Text('uncorrect_phone_sms'.tr()),
            duration: const Duration(milliseconds: 6000),
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
                padding: const EdgeInsets.only(bottom: 10.0),
                child: TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    autofocus: false,
                    controller: firstNameController,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15.sp,
                    ),
                    validator: (firstName) {
                      if (firstName == null || firstName.isEmpty) {
                        return 'write_name_error'.tr();
                      }
                    },
                    onChanged: (fistName) {
                      if (fistName != '') {
                        registerGlobalKey.currentState!.validate();
                      }
                    },
                    decoration: InputDecoration(
                      labelText: 'first_name_label'.tr(),
                      contentPadding:
                          const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(
                            color: Colors.white,
                          )),
                      enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(color: Colors.white)),
                      focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(color: Colors.white)),
                      labelStyle: const TextStyle(color: Colors.white70),
                    )),
              ),
              Container(
                padding: const EdgeInsets.only(bottom: 10.0),
                child: TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    autofocus: false,
                    controller: lastNameController,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15.sp,
                    ),
                    validator: (lastName) {
                      if (lastName == null || lastName.isEmpty) {
                        return 'writre_last_name_error'.tr();
                      }
                    },
                    onChanged: (lastName) {
                      if (lastName != '') {
                        registerGlobalKey.currentState!.validate();
                      }
                    },
                    decoration: InputDecoration(
                      labelText: 'last_name_label'.tr(),
                      contentPadding:
                          const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(
                            color: Colors.white,
                          )),
                      enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(color: Colors.white)),
                      focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(color: Colors.white)),
                      labelStyle: const TextStyle(color: Colors.white70),
                    )),
              ),
              Container(
                padding: const EdgeInsets.only(bottom: 10.0),
                child: TextFormField(
                    keyboardType: TextInputType.emailAddress,
                    autofocus: false,
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 15.sp,
                    ),
                    controller: emailController,
                    validator: (email) {
                      if (isEmailValid(email)) {
                        return null;
                      } else {
                        return 'email';
                      }
                    },
                    onChanged: (email) {
                      if (email != '') {
                        registerGlobalKey.currentState!.validate();
                      }
                    },
                    decoration: InputDecoration(
                      labelText: 'email_label'.tr(),
                      contentPadding:
                          const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                      border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(
                            color: Colors.white,
                          )),
                      enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(color: Colors.white)),
                      focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(18.r),
                          borderSide: const BorderSide(color: Colors.white)),
                      labelStyle: const TextStyle(color: Colors.white70),
                    )),
              ),
              SizedBox(
                width: 1.sw,
                child: RaisedButton(
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18.r),
                  ),
                  onPressed: () {
                    unfocus();
                    if (registerGlobalKey.currentState!.validate()) {
                      showDialog<String>(
                          context: context,
                          builder: (BuildContext context) {
                            return StatefulBuilder(
                                builder: (context, setState) {
                              return AlertDialog(
                                backgroundColor: Colors.white,
                                shape: RoundedRectangleBorder(
                                    borderRadius: BorderRadius.all(
                                        Radius.circular(18.r))),
                                title: Column(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.notifications,
                                        color: Colors.blueAccent, size: 40.sp),
                                    SizedBox(
                                      height: 5.h,
                                    ),
                                    Text(
                                      'feedback'.tr(),
                                      style: TextStyle(
                                          color: Colors.black87,
                                          fontSize: 18.sp),
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
                                          icon: Icon(
                                            MyFlutterApp.local_phone,
                                            size: 35.sp,
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
                                          icon: Icon(
                                            MyFlutterApp.telegram_plane,
                                            size: 35.sp,
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
                                          icon: Icon(
                                            MyFlutterApp.viber,
                                            size: 35.sp,
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
                                    child: Text(
                                      'next_btn'.tr(),
                                      style: TextStyle(fontSize: 16.sp),
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
                  padding: const EdgeInsets.all(12),
                  color: const Color(0xff1573B4),
                  child: Text('register_btn'.tr(),
                      style: const TextStyle(color: Colors.white)),
                ),
              ),
              Text(
                'user_not_exist'.tr(),
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.white54),
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
                    ? 100.r
                    : 75.r,
                child: Image.asset('assets/bg-1.png'),
              )),
          Container(
            padding: const EdgeInsets.only(bottom: 10.0),
            child: TextFormField(
              validator: (number) {
                if (isNumberValid(number) || number == '') {
                  return null;
                } else {
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
                fontSize: 15.sp,
              ),
              decoration: InputDecoration(
                contentPadding:
                    const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18.r),
                    borderSide: const BorderSide(
                      color: Colors.white,
                    )),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18.r),
                    borderSide: const BorderSide(color: Colors.white)),
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18.r),
                    borderSide: const BorderSide(color: Colors.white)),
                focusedErrorBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18.r),
                    borderSide: const BorderSide(
                      color: Color(0xffEC1C24),
                    )),
                errorStyle:
                    TextStyle(color: const Color(0xffEC1C24), fontSize: 16.sp),
                labelStyle: TextStyle(color: Colors.white70, fontSize: 17.sp),
                hintStyle: const TextStyle(color: Colors.white),
                labelText: 'phone_number_label'.tr(),
              ),
            ),
          ),
          if (isLoginText)
            Column(
              children: [
                SizedBox(
                  height: 10.h,
                ),
                Text(
                  'write_phone_number'.tr(),
                  style: const TextStyle(color: Colors.white54),
                ),
                SizedBox(
                  height: 10.h,
                ),
                Text('example_phone_number'.tr(),
                    style: const TextStyle(color: Colors.white60))
              ],
            ),
          if (currentStateRegisterFields == RegisterFields.SHOW_REGISTER_FIELDS)
            getRegisterFields(context),
          if (currentStateRegisterFields == RegisterFields.HIDE_REGISTER_FIELDS)
            ScaleTransition(
                scale: _animationSuccess,
                alignment: Alignment.center,
                child: Container(
                  padding: const EdgeInsets.symmetric(vertical: 5.0),
                  width: 1.sw,
                  child: RaisedButton(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20.r),
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
                    padding: const EdgeInsets.all(12),
                    color: const Color(0xff1573B4),
                    child: const Text('Отправить код',
                        style: TextStyle(color: Colors.white)),
                  ),
                )),
          if (loaderStatusForm)
            SizedBox(
              width: 40.w,
              height: 40.h,
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
              radius: 100.r,
              child: Image.asset('assets/bg-1.png'),
            )),
        Container(
          padding: const EdgeInsets.only(bottom: 10.0),
          child: TextFormField(
              style: TextStyle(
                color: Colors.white,
                fontSize: 15.sp,
              ),
              keyboardType: TextInputType.emailAddress,
              autofocus: false,
              controller: otpController,
              decoration: InputDecoration(
                labelText: 'confirm_code_label'.tr(),
                contentPadding:
                    const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18.r),
                    borderSide: const BorderSide(
                      color: Colors.white,
                    )),
                enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18.r),
                    borderSide: const BorderSide(color: Colors.white)),
                focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(18.r),
                    borderSide: const BorderSide(color: Colors.white)),
                labelStyle: TextStyle(color: Colors.white70, fontSize: 17.sp),
              )),
        ),
        Container(
          width: 1.sw,
          padding: const EdgeInsets.symmetric(vertical: 1.0),
          child: RaisedButton(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18.r),
            ),
            onPressed: () async {
              unfocus();
              PhoneAuthCredential phoneAuthCredential =
                  PhoneAuthProvider.credential(
                      verificationId: verificationId,
                      smsCode: otpController.text);
              signInWithPhoneAuthCredentional(phoneAuthCredential);
            },
            padding: const EdgeInsets.all(12),
            color: const Color(0xff1573B4),
            child: Text('next_btn'.tr(),
                style: const TextStyle(color: Colors.white)),
          ),
        ),
        Container(
          width: 1.sw,
          padding: const EdgeInsets.symmetric(vertical: 1.0),
          child: RaisedButton(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(18.r),
            ),
            onPressed: () async {
              unfocus();
              setState(() {
                currentState = MobileVereficationState.SHOW_MOBILE_FORM_STATE;
                currentStateRegisterFields =
                    RegisterFields.SHOW_REGISTER_FIELDS;
                loaderStatusForm = false;
              });
              await prepareFields(phoneController.text);
            },
            padding: const EdgeInsets.all(12),
            color: const Color(0xff1573B4).withOpacity(0.6),
            child: Text('back_btn'.tr(),
                style: const TextStyle(color: Colors.white)),
          ),
        ),
        SizedBox(height: 10.h),
        Text(
          'write_sms_code'.tr(),
          textAlign: TextAlign.center,
          style: const TextStyle(color: Colors.white54),
        ),
        if (loaderStatusOtp)
          SizedBox(
            width: 40.w,
            height: 40.h,
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
        backgroundColor: const Color(0xff2e3094),
        body: Center(
          child: ListView(
            padding: const EdgeInsets.only(left: 24.0, right: 24.0),
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
