// GENERATED CODE - DO NOT MODIFY BY HAND
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'intl/messages_all.dart';

// **************************************************************************
// Generator: Flutter Intl IDE plugin
// Made by Localizely
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, lines_longer_than_80_chars
// ignore_for_file: join_return_with_assignment, prefer_final_in_for_each
// ignore_for_file: avoid_redundant_argument_values, avoid_escaping_inner_quotes

class S {
  S();

  static S? _current;

  static S get current {
    assert(_current != null,
        'No instance of S was loaded. Try to initialize the S delegate before accessing S.current.');
    return _current!;
  }

  static const AppLocalizationDelegate delegate = AppLocalizationDelegate();

  static Future<S> load(Locale locale) {
    final name = (locale.countryCode?.isEmpty ?? false)
        ? locale.languageCode
        : locale.toString();
    final localeName = Intl.canonicalizedLocale(name);
    return initializeMessages(localeName).then((_) {
      Intl.defaultLocale = localeName;
      final instance = S();
      S._current = instance;

      return instance;
    });
  }

  static S of(BuildContext context) {
    final instance = S.maybeOf(context);
    assert(instance != null,
        'No instance of S present in the widget tree. Did you add S.delegate in localizationsDelegates?');
    return instance!;
  }

  static S? maybeOf(BuildContext context) {
    return Localizations.of<S>(context, S);
  }

  /// `Profile`
  String get profile_app_bar {
    return Intl.message(
      'Profile',
      name: 'profile_app_bar',
      desc: '',
      args: [],
    );
  }

  /// `Feedback`
  String get profile_feedback {
    return Intl.message(
      'Feedback',
      name: 'profile_feedback',
      desc: '',
      args: [],
    );
  }

  /// `History of orders`
  String get profile_order_history_btn {
    return Intl.message(
      'History of orders',
      name: 'profile_order_history_btn',
      desc: '',
      args: [],
    );
  }

  /// `Exit`
  String get profile_exit_btn {
    return Intl.message(
      'Exit',
      name: 'profile_exit_btn',
      desc: '',
      args: [],
    );
  }

  /// `Save`
  String get profile_save_btn {
    return Intl.message(
      'Save',
      name: 'profile_save_btn',
      desc: '',
      args: [],
    );
  }

  /// `Choose at least one feedback method`
  String get profile_error_notification {
    return Intl.message(
      'Choose at least one feedback method',
      name: 'profile_error_notification',
      desc: '',
      args: [],
    );
  }

  /// `Internet connection not found`
  String get connection_status_failed {
    return Intl.message(
      'Internet connection not found',
      name: 'connection_status_failed',
      desc: '',
      args: [],
    );
  }

  /// `Parts search`
  String get order_app_bar {
    return Intl.message(
      'Parts search',
      name: 'order_app_bar',
      desc: '',
      args: [],
    );
  }

  /// `Failed to load data`
  String get order_dropdown_error {
    return Intl.message(
      'Failed to load data',
      name: 'order_dropdown_error',
      desc: '',
      args: [],
    );
  }

  /// `Loading`
  String get order_loading {
    return Intl.message(
      'Loading',
      name: 'order_loading',
      desc: '',
      args: [],
    );
  }

  /// `Tap to try again`
  String get order_button_retry_request {
    return Intl.message(
      'Tap to try again',
      name: 'order_button_retry_request',
      desc: '',
      args: [],
    );
  }
}

class AppLocalizationDelegate extends LocalizationsDelegate<S> {
  const AppLocalizationDelegate();

  List<Locale> get supportedLocales {
    return const <Locale>[
      Locale.fromSubtags(languageCode: 'en'),
      Locale.fromSubtags(languageCode: 'ru'),
    ];
  }

  @override
  bool isSupported(Locale locale) => _isSupported(locale);
  @override
  Future<S> load(Locale locale) => S.load(locale);
  @override
  bool shouldReload(AppLocalizationDelegate old) => false;

  bool _isSupported(Locale locale) {
    for (var supportedLocale in supportedLocales) {
      if (supportedLocale.languageCode == locale.languageCode) {
        return true;
      }
    }
    return false;
  }
}
