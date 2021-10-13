import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointDriveTypeProvider {
  final Dio _client;

  EndpointDriveTypeProvider(this._client);

  Future getDriveType() async {
    try {

      final Response<List<dynamic>> response = await _client.get("/transport/drive-types");
      return response.data;

    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
