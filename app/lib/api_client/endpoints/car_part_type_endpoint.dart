import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointCarPartTypeProvider {
  final Dio _client;

  EndpointCarPartTypeProvider(this._client);

  Future getCarPartType() async {
    try {

      final Response<List<dynamic>> response = await _client.get("/transport/part-types");
      return response.data;

    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
