import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointGetSelfProvider {
  final Dio _client;

  EndpointGetSelfProvider(this._client);

  Future getSelf() async {
    try {
      final Response response = await _client.get("/user/self");
      return response;

    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
