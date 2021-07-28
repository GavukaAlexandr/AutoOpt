import 'package:mobx/mobx.dart';

part 'user_form_store.g.dart';

class UserFormStore = _UserFormStore with _$UserFormStore;

abstract class _UserFormStore with Store {
  @observable
  String userName = '';

  @observable
  String email = '';

  @observable
  String phone = '';

  @action
  void setUsername(String value) {
    userName = value;
  }

  @action
  void setEmail(String value) {
    email = value;
  }

  @action
  void setPassword(String value) {
    phone = value;
  }
}
