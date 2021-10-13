import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointModelsProvider {
  final Dio _client;
  
  EndpointModelsProvider(this._client);
  
  Future getModels(String transportType, String brand) async {
  try {
      final Response<List<dynamic>> response = await _client.get("/transport/models/$transportType/$brand");
      return response.data;
    }
    on DioError catch(ex){
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}