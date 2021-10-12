import 'package:avto_opt/api_client/api_client.dart';
import 'package:avto_opt/api_client/endpoints/change_notif_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/get_self_endpoint.dart';
import 'package:dio/dio.dart';
import 'package:mobx/mobx.dart';
part 'user_form_store.g.dart';

class UserFormStore = _UserFormStore with _$UserFormStore;

abstract class _UserFormStore with Store {
  final Client _client = Client();

  @observable
  bool isEditing = false;

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

  @action
  changeEditing(value) {
    isEditing = value;
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
    loaderStatus = true;
    var _endpointProvider = EndpointChangeNotificationProvider(_client.init());
    Map<String, bool> preparedData = {
      "telegramNotification": user.notificationTelegram,
      "viberNotification": user.notificationViber,
      "phoneNotification": user.notificationPhone
    };
    await _endpointProvider.changeNotification(preparedData);
    loaderStatus = false;
  }

  @action
  Future getSelf() async {
    loaderStatus = true;
    var _endpointProvider = EndpointGetSelfProvider(_client.init());
    Response response = await _endpointProvider.getSelf();
    user = User.fromJson(response.data);
    loaderStatus = false;
    loaderStatus = false;
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
