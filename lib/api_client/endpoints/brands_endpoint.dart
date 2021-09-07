import 'dart:convert';
import 'package:avto_opt/state/search_form_store.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EndpointBrandsProvider {
  Dio _client;
  
  EndpointBrandsProvider(this._client);
  
  Future getBrands(String type) async {
  try {
      Response<List<dynamic>> response = await _client.get("/transport/brands/$type");
      return response.data;
    }
    on DioError catch(ex){
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw new Exception(errorMessage);
    }
  }
}