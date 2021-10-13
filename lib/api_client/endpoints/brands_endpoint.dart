import 'dart:convert';
import 'package:dio/dio.dart';

class EndpointBrandsProvider {
  final Dio _client;
  
  EndpointBrandsProvider(this._client);
  
  Future getBrands(String type) async {
  try {
      final Response<List<dynamic>> response = await _client.get("/transport/brands/$type");
      return response.data;
    }
    on DioError catch(ex){
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw Exception(errorMessage);
    }
  }
}