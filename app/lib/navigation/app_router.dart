import 'package:avto_opt/navigation/app_state_manager.dart';
import 'package:avto_opt/screens/error_pages/error_connection_server.dart';
import 'package:avto_opt/screens/loading_screen.dart';
import 'package:avto_opt/screens/login/confirm_page.dart';
import 'package:avto_opt/screens/login/login_page.dart';
import 'package:avto_opt/screens/login/widgets/login_repository.dart';
import 'package:avto_opt/screens/order/order_page.dart';
import 'package:flutter/material.dart';

class AppRouter extends RouterDelegate
    with ChangeNotifier, PopNavigatorRouterDelegateMixin {
  @override
  final GlobalKey<NavigatorState> navigatorKey;

  final AppStateManager appStateManager;
  final LoginRepository authFireBaseManager;

  AppRouter({
    required this.authFireBaseManager,
    required this.appStateManager,
  }) : navigatorKey = GlobalKey<NavigatorState>() {
    appStateManager.addListener(notifyListeners);
    authFireBaseManager.addListener(notifyListeners);
  }

  @override
  void dispose() {
    appStateManager.removeListener(notifyListeners);
    authFireBaseManager.removeListener(notifyListeners);
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Navigator(
      key: navigatorKey,
      onPopPage: _handlePopPage,
      pages: [
        if (!appStateManager.isInitialized) SplashPage.page(),

        if (appStateManager.isErrorPage) ErrorConnectionServer.page(),

        if (appStateManager.isInitialized && appStateManager.isToken)
          OrderPage.page(),

        if (appStateManager.isInitialized &&
            !appStateManager.isLoggedIn &&
            !appStateManager.isToken)
          LoginPage.page(),

        if (appStateManager.isLoggedIn &&
            !appStateManager.confirmedCode &&
            !appStateManager.isToken)
          ConfirmCodePage.page(),

        // if (appStateManager.confirmedCode && !appStateManager.onOrder)
        //   OrderPage.page(),

        // TODO: Add Home
        // TODO: Create new item
        // TODO: Select GroceryItemScreen
        // TODO: Add Profile Screen
        // TODO: Add WebView Screen
      ],
    );
  }

  bool _handlePopPage(Route<dynamic> route, result) {
    if (!route.didPop(result)) {
      return false;
    }

    // TODO: Handle Onboarding and splash
    // TODO: Handle state when user closes grocery item screen
    // TODO: Handle state when user closes profile screen
    // TODO: Handle state when user closes WebView screen
    return true;
  }

  @override
  Future<void> setNewRoutePath(configuration) async => null;
}
