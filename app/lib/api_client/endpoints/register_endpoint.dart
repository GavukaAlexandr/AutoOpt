import 'package:dio/dio.dart';

class EndpointRegisterProvider {
  final Dio _client;

  EndpointRegisterProvider(this._client);

  Future register(data) async {
    try {
      final Response response = await _client.post('/user/register', data: data);
      var result = response.statusCode;
      return result;
    } on DioError catch (ex) {
      if (ex.type == DioErrorType.connectTimeout) {
        return "Connection Timeout Exception";
      }
      return ex.response!.statusCode;
    }
  }
}
