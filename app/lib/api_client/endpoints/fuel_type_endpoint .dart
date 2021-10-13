import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointFuelTypeProvider {
  final Dio _client;

  EndpointFuelTypeProvider(this._client);

  Future getFuelType() async {
    try {

      final Response<List<dynamic>> response = await _client.get("/transport/fuel-types");
      return response.data;

    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
