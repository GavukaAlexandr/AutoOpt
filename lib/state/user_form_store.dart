import 'package:mobx/mobx.dart';
import 'package:validators/validators.dart';
part 'user_form_store.g.dart';

class FormErrorState = _FormErrorState with _$FormErrorState;

abstract class _FormErrorState with Store {
  @observable
  String? username;

  @observable
  String? email;

  @observable
  String? numberPhone;

  @computed
  bool get hasErrors =>
      username != null || email != null || numberPhone != null;
}

class UserFormStore = _UserFormStore with _$UserFormStore;

abstract class _UserFormStore with Store {
  final FormErrorState error = FormErrorState();

  @observable
  String userName = '';

  @observable
  String email = '';

  @observable
  String numberPhone = '';

  @observable
  bool telegram = false;

  @observable
  bool phone = false;

  @observable
  bool viber = false;

  @action
  void setTelegram(bool value) {
    telegram = value;
  }

  @action
  void setPhone(bool value) {
    phone = value;
  }

  @action
  void setViber(bool value) {
    viber = value;
  }

  @action
  void setUsername(String value) {
    userName = value;
  }

  @action
  void setEmail(String value) {
    email = value;
  }

  @action
  void setNumberPhone(String value) {
    numberPhone = value;
  }

  late List<ReactionDisposer> _disposers;

  void setupValidations() {
    _disposers = [
      reaction((_) => userName, validateUsername),
      reaction((_) => email, validateEmail),
      reaction((_) => numberPhone, validateNumberPhone),
    ];
  }

  @action
  void validateUsername(String value) {
    if (isNull(value) || value.isEmpty) {
      error.username = 'Поле обязательно';
      return;
    }

    error.username = null;
  }

  @action
  void validateNumberPhone(String value) {
    error.numberPhone =
        isNull(value) || value.isEmpty ? 'Поле обязательно' : null;
  }

  @action
  void validateEmail(String value) {
    error.email = isEmail(value) ? null : 'Email некорректный';
  }

  void dispose() {
    for (final d in _disposers) {
      d();
    }
  }

  void validateAll() {
    validateNumberPhone(numberPhone);
    validateEmail(email);
    validateUsername(userName);
  }
}
