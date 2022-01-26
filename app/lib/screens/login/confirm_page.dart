import 'package:avto_opt/navigation/ui_pages.dart';
import 'package:avto_opt/screens/login/widgets/confirm_code_form.dart';
import 'package:flutter/material.dart';

class ConfirmCodePage extends StatefulWidget {
  const ConfirmCodePage({Key? key}) : super(key: key);

  static MaterialPage page() {
    return const MaterialPage(
      name: confirmLoginPath,
      key: ValueKey(confirmLoginPath),
      child: ConfirmCodePage(),
    );
  }

  @override
  State<ConfirmCodePage> createState() => _ConfirmCodePageState();
}

class _ConfirmCodePageState extends State<ConfirmCodePage> {
  final TextEditingController otpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      child: Scaffold(
        backgroundColor: const Color(0xff2e3094),
        body: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: ConfirmCodeForm(otpController: otpController),
        ),
      ),
    );
  }
}
