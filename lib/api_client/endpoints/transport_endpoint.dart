import 'dart:convert';
import 'package:avto_opt/state/search_form_store.dart';
import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class EndpointTransportProvider {
  Dio _client;
  
  EndpointTransportProvider(this._client);
  
  Future getTransport() async {
  try {
      Response<List<dynamic>> response = await _client.get("/transport");
      var preparedTransport = response.data!.map((element) => {
            'value': element['id'],
            'title': transportTranslate[element['name']]
          });
      return preparedTransport;
    }
    on DioError catch(ex){
      String errorMessage = json.decode(ex.response.toString())["errorMessage"];
      throw new Exception(errorMessage);
    }
  }
}