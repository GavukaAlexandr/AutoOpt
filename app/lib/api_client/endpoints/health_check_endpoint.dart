import 'package:dio/dio.dart';

class EndpointHealthCheckProvider {
  final Dio _client = Dio();
  Future healthCheckHttp() async {
    try {
      final Response response = await _client.get("https://auto-opt.cyber-geeks-lab.synology.me/health");
      return response;
    } on DioError catch (ex) {
      return ex.response;
    }
  }
}
