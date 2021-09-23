import 'dart:async';
import 'package:avto_opt/api_client/endpoints/login_endpoint.dart';
import "package:dio/dio.dart";
import 'package:shared_preferences/shared_preferences.dart';

class Client {
  Dio init() {
    Dio _dio = Dio();
    _dio.interceptors.add(ApiInterceptors(dio: _dio));
    _dio.options = BaseOptions(
        baseUrl: "https://auto-opt.cyber-geeks-lab.synology.me",
        receiveDataWhenStatusError: true,
        connectTimeout: 30000,
        receiveTimeout: 30000 
        );
    //! DEV http://192.168.88.30:3000
    //! PROD https://auto-opt.cyber-geeks-lab.synology.me
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
      Client _client = Client();
      var _endpointProvider = EndpointLoginProvider(_client.init());
      if (e.response!.statusCode == 401) {
        await _endpointProvider.login();
        final prefs = await SharedPreferences.getInstance();
        var _accessToken = prefs.getString('token');
        final RequestOptions options = e.response!.requestOptions;
        try {
          options.headers['Authorization'] = 'Bearer $_accessToken';
          final Response response = await dio.fetch(options);
          return handler.resolve(response);
        } catch (e) {
          throw Exception(e);
        }
      }
    return handler.next(e);
  }

  // @override
  // Future<dynamic> onResponse(Response response) async {
  //   // do something before response
  // }
}
