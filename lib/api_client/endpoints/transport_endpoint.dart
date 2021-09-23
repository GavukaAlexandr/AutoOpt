import 'dart:convert';
import 'package:dio/dio.dart';
class EndpointTransportProvider {
  final Dio _client;

  EndpointTransportProvider(this._client);

  Future getTransport() async {
    try {
      final Response<List<dynamic>> response = await _client.get("/transport");
      var preparedTransport = response.data!
          .map((element) => {'value': element['id'], 'title': element['name'].toString().toLowerCase()})
          .toList();
      return preparedTransport;
    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
