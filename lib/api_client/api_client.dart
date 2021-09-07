import 'dart:async';
import 'package:avto_opt/api_client/endpoints/login_endpoint.dart';
import "package:dio/dio.dart";
import 'package:shared_preferences/shared_preferences.dart';

class Client {
  Dio init() {
    Dio _dio = new Dio();
    _dio.interceptors.add(new ApiInterceptors(dio: _dio));
    _dio.options.baseUrl = "https://auto-opt.cyber-geeks-lab.synology.me";
    return _dio;
  }
}

class ApiInterceptors extends Interceptor {
  Dio dio;

  ApiInterceptors({required this.dio});

  @override
  Future<dynamic> onRequest(options, h) async {
    final prefs = await SharedPreferences.getInstance();
    var accessToken = prefs.getString('token');
    options.headers['Authorization'] = 'Bearer $accessToken';
    return h.next(options);
  }

  @override
  Future<dynamic> onError(e, handler) async {
    Client _client = new Client();
    final prefs = await SharedPreferences.getInstance();
    var _endpointProvider = new EndpointLoginProvider(_client.init());
    _endpointProvider.login();
      if (e.response!.statusCode == 401) {
        await _endpointProvider.login();
        final prefs = await SharedPreferences.getInstance();
        var _accessToken = prefs.getString('token');
        _accessToken = null;
        final RequestOptions options = e.response!.requestOptions;
        try {
          options.headers['Authorization'] = 'Bearer $_accessToken';
          final Response response = await dio.fetch(options);
          return handler.resolve(response);
        } catch (e, s) {
          print(e);
          print(s);
        }
      }

      return handler.next(e);
    }

  // @override
  // Future<dynamic> onResponse(Response response) async {
  //   // do something before response
  // }
}
