import 'dart:convert';
import 'dart:developer';

import 'package:dio/dio.dart';
import 'package:mobx/mobx.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:validators/validators.dart';
part 'user_form_store.g.dart';

class UserFormStore = _UserFormStore with _$UserFormStore;

abstract class _UserFormStore with Store {
  @observable
  User user = User(
      email: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      notificationPhone: false,
      notificationTelegram: false,
      notificationViber: false);

  @observable
  bool loaderStatus = false;

  login() async {
    final prefs = await SharedPreferences.getInstance();
    try {
      var response = await Dio().post(
          "https://auto-opt.cyber-geeks-lab.synology.me/auth/login",
          data: {
            "phoneNumber": prefs.getString('phone').toString(),
            "firebaseUid": prefs.getString('user-uid').toString()
          });
      var result = response.data;
      prefs.setString('token', result['access_token']);
    } catch (e) {
      print(e);
    }
  }

  @action
  setNotification(name, value) {
    switch (name) {
      case 'telegram':
        user.notificationTelegram = value;
        break;
      case 'viber':
        user.notificationViber = value;
        break;
      case 'phone':
        user.notificationPhone = value;
        break;
      default:
    }
  }

  @action
  Future changeNotification() async {
    Dio dio = Dio();

    dio.interceptors.add(InterceptorsWrapper(onRequest: (options, h) async {
      final prefs = await SharedPreferences.getInstance();
      var accessToken = prefs.getString('token');
      options.headers['Authorization'] = 'Bearer $accessToken';
      return h.next(options);
    }, onError: (e, handler) async {
      if (e.response!.statusCode == 401) {
        await login();
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
    }));
    loaderStatus = true;
    try {
      Response response = await dio
          .put("https://auto-opt.cyber-geeks-lab.synology.me/user/notifications", data: {
        "telegramNotification": user.notificationTelegram,
        "viberNotification": user.notificationViber,
        "phoneNotification": user.notificationPhone
      });
      loaderStatus = false;
    } catch (e) {
      loaderStatus = false;
      print('Error: $e');
    }
  }

  @action
  Future getSelf() async {
    Dio dio = Dio();

    dio.interceptors.add(InterceptorsWrapper(onRequest: (options, h) async {
      final prefs = await SharedPreferences.getInstance();
      var accessToken = prefs.getString('token');
      options.headers['Authorization'] = 'Bearer $accessToken';
      return h.next(options);
    }, onError: (e, handler) async {
      if (e.response!.statusCode == 401) {
        await login();
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
    }));
    loaderStatus = true;
    try {
      Response response = await dio
          .get("https://auto-opt.cyber-geeks-lab.synology.me/user/self");
      user = User.fromJson(response.data);
      loaderStatus = false;
    } catch (e) {
      loaderStatus = false;
      print('Error: $e');
    }
  }
}

class User {
  String firstName;
  String lastName;
  String email;
  String phoneNumber;
  bool notificationTelegram;
  bool notificationPhone;
  bool notificationViber;

  User(
      {required this.firstName,
      required this.lastName,
      required this.email,
      required this.phoneNumber,
      required this.notificationTelegram,
      required this.notificationPhone,
      required this.notificationViber});

  factory User.fromJson(Map<String, dynamic> jsonMap) {
    return User(
        firstName: jsonMap['firstName'] ?? 'No firstName Found',
        lastName: jsonMap['lastName'] ?? 'No lastName found',
        email: jsonMap['email'] ?? 'No Email found',
        phoneNumber: jsonMap['phoneNumber'] ?? 'No Number found',
        notificationViber: jsonMap['viberNotification'] ?? false,
        notificationTelegram: jsonMap['telegramNotification'] ?? false,
        notificationPhone: jsonMap['phoneNotification'] ?? false);
  }

  Map<String, dynamic> toJson() => {
        'firstName': firstName,
        'lastName': lastName,
        'phoneNumber': phoneNumber,
        'notificationViber': notificationViber,
        'notificationTelegram': notificationTelegram,
        'notificationPhone': notificationPhone
      };
}
