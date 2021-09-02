// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_form_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic

mixin _$UserFormStore on _UserFormStore, Store {
  final _$userAtom = Atom(name: '_UserFormStore.user');

  @override
  User get user {
    _$userAtom.reportRead();
    return super.user;
  }

  @override
  set user(User value) {
    _$userAtom.reportWrite(value, super.user, () {
      super.user = value;
    });
  }

  final _$loaderStatusAtom = Atom(name: '_UserFormStore.loaderStatus');

  @override
  bool get loaderStatus {
    _$loaderStatusAtom.reportRead();
    return super.loaderStatus;
  }

  @override
  set loaderStatus(bool value) {
    _$loaderStatusAtom.reportWrite(value, super.loaderStatus, () {
      super.loaderStatus = value;
    });
  }

  final _$getSelfAsyncAction = AsyncAction('_UserFormStore.getSelf');

  @override
  Future getSelf() {
    return _$getSelfAsyncAction.run(() => super.getSelf());
  }

  final _$_UserFormStoreActionController =
      ActionController(name: '_UserFormStore');

  @override
  dynamic setNotification(dynamic name, dynamic value) {
    final _$actionInfo = _$_UserFormStoreActionController.startAction(
        name: '_UserFormStore.setNotification');
    try {
      return super.setNotification(name, value);
    } finally {
      _$_UserFormStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
user: ${user},
loaderStatus: ${loaderStatus}
    ''';
  }
}
