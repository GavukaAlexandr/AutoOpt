
import 'package:dio/dio.dart';

class EndpointChangeNotificationProvider {
  final Dio _client;
  
  EndpointChangeNotificationProvider(this._client);
  
  Future changeNotification(data) async {
    try{
      final Response response = await _client.post('/user/notifications', data: data);
      return response.statusCode;
    }
    on DioError catch(ex){
      return ex.response!.statusCode;
    }
  }
}