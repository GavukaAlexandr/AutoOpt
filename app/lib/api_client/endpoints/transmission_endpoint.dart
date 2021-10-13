import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointTransmissionProvider {
  final Dio _client;

  EndpointTransmissionProvider(this._client);

  Future getTransmisson() async {
    try {

      final Response<List<dynamic>> response = await _client.get("/transport/transmission-types");
      return response.data;

    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
