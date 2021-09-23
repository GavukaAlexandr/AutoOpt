import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointOrderProvider {
  final Dio _client;

  EndpointOrderProvider(this._client);

  sendOrder(data) async {
    try {
      final Response response = await _client.post('/order', data: data);
      return response.statusCode;
    } on DioError catch (ex) {
      return ex.response!.statusCode;
    }
  }

  Future getLastOrder() async {
    try {
      Response response = await _client.get("/order/last");
      return response.data;
    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }

  Future getOrders() async {
    try {
      final Response response = await _client.get("/order/all");
      return response.data;
    } on DioError catch (ex) {
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}
