import 'package:avto_opt/navigation/ui_pages.dart';
import 'package:easy_localization/src/public_ext.dart';
import 'package:flutter/material.dart';

import '../error_connection_screen.dart';

class ErrorConnectionServer extends StatelessWidget {
  const ErrorConnectionServer({Key? key}) : super(key: key);

  static MaterialPage page() {
    return const MaterialPage(
      name: errorPagePath,
      key: ValueKey(errorPagePath),
      child: ErrorConnectionServer(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      locale: context.locale,
      debugShowCheckedModeBanner: false,
      localizationsDelegates: context.localizationDelegates,
      supportedLocales: context.supportedLocales,
      home: const ConnectionFaildScreen(),
    );
  }
}
