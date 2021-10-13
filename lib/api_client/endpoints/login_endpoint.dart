
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EndpointLoginProvider {
  final Dio _client;
  
  EndpointLoginProvider(this._client);
  
  Future login() async {
    final prefs = await SharedPreferences.getInstance();
    try{
      final response = await _client.post('/auth/login', data: {
            "phoneNumber": prefs.getString('phone').toString(),
            "firebaseUid": prefs.getString('user-uid').toString()
          });
      var result = response.data;
      prefs.setString('token', result['access_token']);
    }
    on DioError catch(ex){
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}