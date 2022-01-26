import 'package:avto_opt/navigation/app_state_manager.dart';
import 'package:avto_opt/navigation/ui_pages.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class OrderPage extends StatefulWidget {
  const OrderPage({Key? key}) : super(key: key);

  static MaterialPage page() {
    return const MaterialPage(
      name: ordersPath,
      key: ValueKey(ordersPath),
      child: OrderPage(),
    );
  }

  @override
  _OrderPageState createState() => _OrderPageState();
}

class _OrderPageState extends State<OrderPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text('Order Page'),
            TextButton(
                onPressed: () {
                  Provider.of<AppStateManager>(context, listen: false).logout();
                },
                child: Text('exit')),
          ],
        ),
      ),
    );
  }
}
