import 'dart:async';

import 'package:avto_opt/navigation/app_state_manager.dart';
import 'package:avto_opt/navigation/ui_pages.dart';
import 'package:avto_opt/screens/login/widgets/login_form.dart';
import 'package:avto_opt/screens/login/widgets/login_repository.dart';
import 'package:avto_opt/screens/login/widgets/register_form.dart';
import 'package:flutter/material.dart';

class LoginPage extends StatefulWidget {
  const LoginPage({Key? key}) : super(key: key);

  static MaterialPage page() {
    return const MaterialPage(
      name: loginPath,
      key: ValueKey(loginPath),
      child: LoginPage(),
    );
  }

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  Timer? _debounce;
  bool isRegister = false;

  _onSearchChanged(String value, LoginRepository repository,
      AppStateManager appStateManager) {
    if (_debounce?.isActive ?? false) _debounce?.cancel();
    _debounce = Timer(const Duration(milliseconds: 500), () async {
      final bool result = await repository.isNumberExist(value);
      if (!result) {
        setState(() {
          isRegister = true;
        });
      } else {
        setState(() {
          isRegister = false;
        });
      }
    });
  }

  @override
  void dispose() {
    _debounce?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: Scaffold(
        backgroundColor: const Color(0xff2e3094),
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: !isRegister
              ? LoginForm(
                  onChangePhoneNumber: _onSearchChanged,
                )
              : RegisterForm(),
        ),
      ),
    );
  }
}
