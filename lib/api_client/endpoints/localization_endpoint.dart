import 'package:dio/dio.dart';

class EndpointLocalizationProvider {
  final Dio _client = Dio();
  Future getLocalization(url) async {
    try {
      final Response response = await _client.get(url);
      return response;
    } on DioError catch (ex) {
      return ex.response;
    }
  }
}
