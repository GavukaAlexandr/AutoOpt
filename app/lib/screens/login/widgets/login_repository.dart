import 'package:avto_opt/api_client/api_client.dart';
import 'package:avto_opt/api_client/endpoints/number_exist_endpoint.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginRepository extends ChangeNotifier {
  final storage = FlutterSecureStorage();

  final FirebaseAuth _auth = FirebaseAuth.instance;
  late String verificationId;
  String phoneNumber = '';
  String otpCode = '';
  final Client _client = Client();

  void setPhoneNumber(String value) {
    phoneNumber = value;
  }

  void setOtp(String value) {
    otpCode = value;
  }

  Future<bool> isNumberExist(String number) async {
    var _endpointProvider = EndpointNumberExistProvider(_client.init());
    bool result = await _endpointProvider.isNumberExist(number);
    return result;
  }

  void sendSms() async {
    await _auth.verifyPhoneNumber(
        phoneNumber: phoneNumber,
        verificationCompleted: (phoneAuthCredential) async {},
        verificationFailed: (phoneVerificationFailed) async {
          print(phoneVerificationFailed.message);
        },
        codeSent: (verificationId, resendingToken) async {
          this.verificationId = verificationId;
        },
        codeAutoRetrievalTimeout: (vereficationId) async {});
  }

  void sendCode() async {
    PhoneAuthCredential phoneAuthCredential = PhoneAuthProvider.credential(
      verificationId: verificationId,
      smsCode: otpCode,
    );
    signInWithPhoneAuthCredentional(phoneAuthCredential);
  }

  void signInWithPhoneAuthCredentional(
      PhoneAuthCredential phoneAuthCredential) async {
    final authCredential =
        await _auth.signInWithCredential(phoneAuthCredential);
    if (authCredential.user != null) {
      await storage.write(key: 'userUid', value: authCredential.user!.uid);
    }
  }
}
