
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EndpointLoginProvider {
  Dio _client;
  
  EndpointLoginProvider(this._client);
  
  Future login() async {
  
    final prefs = await SharedPreferences.getInstance();
    try{
      final response = await _client.post('/auth/login', data: {
            "phoneNumber": prefs.getString('phone').toString(),
            "firebaseUid": prefs.getString('user-uid').toString()
          });
      return response.data;
    }
    on DioError catch(ex){
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw new Exception(errorMessage);
    }
  }
}