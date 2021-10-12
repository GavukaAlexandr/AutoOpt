import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointNumberExistProvider {
  final Dio _client;

  EndpointNumberExistProvider(this._client);

  Future<bool> isNumberExist(number) async {
    try {
      final Response response = await _client
          .post('/user/is-exist', data: {"phoneNumber": number.toString()});
      var result = response.data;
      return result['isUserExist'];
    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
