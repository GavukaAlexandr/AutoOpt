import 'package:avto_opt/navigation/app_state_manager.dart';
import 'package:avto_opt/screens/login/widgets/login_repository.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class LoginForm extends StatelessWidget {
  const LoginForm({
    Key? key,
    required this.onChangePhoneNumber,
  }) : super(key: key);

  final Function(String, LoginRepository, AppStateManager) onChangePhoneNumber;

  @override
  Widget build(BuildContext context) {
    final repository = Provider.of<LoginRepository>(context);
    final appStateManager = Provider.of<AppStateManager>(context);

    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Image.asset(
          'assets/bg-1.png',
          fit: BoxFit.cover,
          width: MediaQuery.of(context).size.width / 2,
        ),
        TextFormField(
          style: const TextStyle(
            color: Colors.white,
            fontSize: 15,
          ),
          onChanged: (value) =>
              onChangePhoneNumber(value, repository, appStateManager),
          keyboardType: TextInputType.emailAddress,
          autofocus: false,
          decoration: InputDecoration(
            labelText: 'Введите номер телефона',
            contentPadding: const EdgeInsets.fromLTRB(20.0, 10.0, 20.0, 10.0),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(18),
              borderSide: const BorderSide(
                color: Colors.white,
              ),
            ),
            enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: const BorderSide(color: Colors.white)),
            focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(18),
                borderSide: const BorderSide(color: Colors.white)),
            labelStyle: const TextStyle(color: Colors.white70, fontSize: 17),
          ),
        ),
        const SizedBox(height: 20),
        SizedBox(
          width: MediaQuery.of(context).size.width,
          child: RaisedButton(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(20),
            ),
            onPressed: () async {
              // await sendCodeCallBack();
              // Provider.of<AppStateManager>(context, listen: false).login();
            },
            padding: const EdgeInsets.all(12),
            color: const Color(0xff1573B4),
            child: const Text('Отправить код',
                style: TextStyle(color: Colors.white)),
          ),
        ),
      ],
    );
  }
}
