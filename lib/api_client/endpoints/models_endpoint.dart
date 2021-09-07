import 'dart:convert';
import 'package:avto_opt/state/search_form_store.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EndpointModelsProvider {
  Dio _client;
  
  EndpointModelsProvider(this._client);
  
  Future getModels(String transportType, String brand) async {
  try {
      Response<List<dynamic>> response = await _client.get("/transport/models/$transportType/$brand");
      return response.data;
    }
    on DioError catch(ex){
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw new Exception(errorMessage);
    }
  }
}