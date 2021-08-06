// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_form_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic

mixin _$UserFormStore on _UserFormStore, Store {
  final _$userNameAtom = Atom(name: '_UserFormStore.userName');

  @override
  String get userName {
    _$userNameAtom.reportRead();
    return super.userName;
  }

  @override
  set userName(String value) {
    _$userNameAtom.reportWrite(value, super.userName, () {
      super.userName = value;
    });
  }

  final _$emailAtom = Atom(name: '_UserFormStore.email');

  @override
  String get email {
    _$emailAtom.reportRead();
    return super.email;
  }

  @override
  set email(String value) {
    _$emailAtom.reportWrite(value, super.email, () {
      super.email = value;
    });
  }

  final _$numberPhoneAtom = Atom(name: '_UserFormStore.numberPhone');

  @override
  String get numberPhone {
    _$numberPhoneAtom.reportRead();
    return super.numberPhone;
  }

  @override
  set numberPhone(String value) {
    _$numberPhoneAtom.reportWrite(value, super.numberPhone, () {
      super.numberPhone = value;
    });
  }

  final _$telegramAtom = Atom(name: '_UserFormStore.telegram');

  @override
  bool get telegram {
    _$telegramAtom.reportRead();
    return super.telegram;
  }

  @override
  set telegram(bool value) {
    _$telegramAtom.reportWrite(value, super.telegram, () {
      super.telegram = value;
    });
  }

  final _$phoneAtom = Atom(name: '_UserFormStore.phone');

  @override
  bool get phone {
    _$phoneAtom.reportRead();
    return super.phone;
  }

  @override
  set phone(bool value) {
    _$phoneAtom.reportWrite(value, super.phone, () {
      super.phone = value;
    });
  }

  final _$viberAtom = Atom(name: '_UserFormStore.viber');

  @override
  bool get viber {
    _$viberAtom.reportRead();
    return super.viber;
  }

  @override
  set viber(bool value) {
    _$viberAtom.reportWrite(value, super.viber, () {
      super.viber = value;
    });
  }

  final _$_UserFormStoreActionController =
      ActionController(name: '_UserFormStore');

  @override
  void setTelegram(bool value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.setTelegram');
    try {
      return super.setTelegram(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setPhone(bool value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.setPhone');
    try {
      return super.setPhone(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setViber(bool value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.setViber');
    try {
      return super.setViber(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setUsername(String value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.setUsername');
    try {
      return super.setUsername(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setEmail(String value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.setEmail');
    try {
      return super.setEmail(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void setNumberPhone(String value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.setNumberPhone');
    try {
      return super.setNumberPhone(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void validateUsername(String value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.validateUsername');
    try {
      return super.validateUsername(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void validateNumberPhone(String value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.validateNumberPhone');
    try {
      return super.validateNumberPhone(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void validateEmail(String value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.validateEmail');
    try {
      return super.validateEmail(value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
userName: ${userName},
email: ${email},
numberPhone: ${numberPhone},
telegram: ${telegram},
phone: ${phone},
viber: ${viber}
    ''';
  }
}

mixin _$FormErrorState on _FormErrorState, Store {
  Computed<bool>? _$hasErrorsComputed;

  @override
  bool get hasErrors =>
      (_$hasErrorsComputed ??= Computed<bool>(() => super.hasErrors,
              name: '_FormErrorState.hasErrors'))
          .value;

  final _$usernameAtom = Atom(name: '_FormErrorState.username');

  @override
  String? get username {
    _$usernameAtom.reportRead();
    return super.username;
  }

  @override
  set username(String? value) {
    _$usernameAtom.reportWrite(value, super.username, () {
      super.username = value;
    });
  }

  final _$emailAtom = Atom(name: '_FormErrorState.email');

  @override
  String? get email {
    _$emailAtom.reportRead();
    return super.email;
  }

  @override
  set email(String? value) {
    _$emailAtom.reportWrite(value, super.email, () {
      super.email = value;
    });
  }

  final _$numberPhoneAtom = Atom(name: '_FormErrorState.numberPhone');

  @override
  String? get numberPhone {
    _$numberPhoneAtom.reportRead();
    return super.numberPhone;
  }

  @override
  set numberPhone(String? value) {
    _$numberPhoneAtom.reportWrite(value, super.numberPhone, () {
      super.numberPhone = value;
    });
  }

  @override
  String toString() {
    return '''
username: ${username},
email: ${email},
numberPhone: ${numberPhone},
hasErrors: ${hasErrors}
    ''';
  }
}
