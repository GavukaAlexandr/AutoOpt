import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointBodyTypeProvider {
  final Dio _client;

  EndpointBodyTypeProvider(this._client);

  Future getTransmisson() async {
    try {
      final Response<List<dynamic>> response =
          await _client.get("/transport/body-types");
      return response.data;
    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
