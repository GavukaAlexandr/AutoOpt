import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import './../state/user_form_store.dart';
import 'package:shared_preferences/shared_preferences.dart';

class Credentials {
  bool telegram;
  bool viber;
  bool phone;
  Credentials({this.telegram = false, this.phone = false, this.viber = false});
}

class UserProfile extends StatefulWidget {
  const UserProfile({Key? key}) : super(key: key);

  @override
  _UserProfile createState() => _UserProfile();
}

class _UserProfile extends State<UserProfile> {
  final userFormStore = UserFormStore();
  final formKey = GlobalKey<FormState>();
  final credentials = Credentials();
  final myUserNameController = TextEditingController();
  final myUserEmailController = TextEditingController();
  final myUserPhoneController = TextEditingController();

  void setData() async {
    final prefs = await SharedPreferences.getInstance();
    if (userFormStore.error.hasErrors == true) return;
    prefs.setString('userName', userFormStore.userName);
    prefs.setString('userEmail', userFormStore.email);
    prefs.setString('userPhone', userFormStore.numberPhone);
    prefs.setBool('telegram', userFormStore.telegram);
    prefs.setBool('phone', userFormStore.phone);
    prefs.setBool('viber', userFormStore.viber);
  }

  void getData() async {
    final prefs = await SharedPreferences.getInstance();
    userFormStore.setUsername(prefs.getString('userName')!);
    userFormStore.setEmail(prefs.getString('userEmail')!);
    userFormStore.setNumberPhone(prefs.getString('userPhone')!);
    userFormStore.setTelegram(prefs.getBool('telegram')!);
    userFormStore.setPhone(prefs.getBool('phone')!);
    userFormStore.setViber(prefs.getBool('viber')!);
    myUserEmailController.text = userFormStore.email;
    myUserNameController.text = userFormStore.userName;
    myUserPhoneController.text = userFormStore.numberPhone;
  }

  @override
  void initState() {
    getData();
    super.initState();
    userFormStore.setupValidations();
    myUserNameController.addListener(setNameValue);
    myUserEmailController.addListener(setEmailValue);
    myUserPhoneController.addListener(setPhoneValue);
  }

  void setNameValue() {
    userFormStore.userName = myUserNameController.text;
  }

  void setPhoneValue() {
    userFormStore.numberPhone = myUserPhoneController.text;
  }

  void setEmailValue() {
    userFormStore.email = myUserEmailController.text;
  }

  @override
  void dispose() {
    userFormStore.dispose();
    myUserNameController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Профиль'),
        centerTitle: true,
        backgroundColor: Colors.blueAccent,
      ),
      body: SafeArea(
          child: Container(
        padding: const EdgeInsets.only(left: 20, right: 20, top: 20),
        child: Column(
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text('Информация',
                    style: TextStyle(fontSize: 24, color: Colors.black87)),
                Icon(
                  Icons.article_outlined,
                  color: Colors.black54,
                  size: 28,
                ),
              ],
            ),
            SizedBox(height: 20),
            Form(
                key: formKey,
                child: Column(
                  children: [
                    Observer(
                      builder: (_) => TextFormField(
                        decoration: InputDecoration(
                            hintText: 'Имя',
                            prefixIcon: Icon(
                              Icons.person_rounded,
                              size: 28,
                            ),
                            errorText: userFormStore.error.username),
                        controller: myUserNameController,
                      ),
                    ),
                    SizedBox(height: 20),
                    Observer(
                      builder: (_) => TextFormField(
                        decoration: InputDecoration(
                            hintText: 'Почта',
                            prefixIcon: Icon(
                              Icons.email,
                              size: 28,
                            ),
                            errorText: userFormStore.error.email),
                        controller: myUserEmailController,
                      ),
                    ),
                    SizedBox(height: 20),
                    Observer(
                      builder: (_) => TextFormField(
                          controller: myUserPhoneController,
                          decoration: InputDecoration(
                              hintText: 'Телефон',
                              prefixIcon: Icon(
                                Icons.phone_enabled,
                                size: 28,
                              ),
                              errorText: userFormStore.error.numberPhone)),
                    ),
                    SizedBox(height: 30),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text('Уведомления',
                            style:
                                TextStyle(fontSize: 24, color: Colors.black87)),
                        Icon(
                          Icons.notifications,
                          color: Colors.black54,
                          size: 28,
                        ),
                      ],
                    ),
                    SizedBox(height: 15),
                    Observer(
                      builder: (_) => SwitchListTile(
                        title: const Text('Telegram',
                            style:
                                TextStyle(fontSize: 22, color: Colors.black54)),
                        value: userFormStore.telegram,
                        key: Key('telegram'),
                        onChanged: (bool value) =>
                            userFormStore.telegram = value,
                      ),
                    ),
                    Observer(
                      builder: (_) => SwitchListTile(
                          title: const Text('Телефон',
                              style: TextStyle(
                                  fontSize: 22, color: Colors.black54)),
                          value: userFormStore.phone,
                          onChanged: (bool value) =>
                              userFormStore.phone = value),
                    ),
                    Observer(
                      builder: (_) => SwitchListTile(
                        title: const Text('Viber',
                            style:
                                TextStyle(fontSize: 22, color: Colors.black54)),
                        value: userFormStore.viber,
                        onChanged: (bool value) => userFormStore.viber = value,
                      ),
                    ),
                    SizedBox(height: 20),
                    OutlinedButton(
                        style: OutlinedButton.styleFrom(
                            padding: EdgeInsets.only(
                                left: 34, right: 34, top: 12, bottom: 12)),
                        onPressed: () {
                          userFormStore.validateAll();
                          if (userFormStore.error.hasErrors) return;
                          setData();
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(
                              action: SnackBarAction(
                                label: 'Закрыть',
                                textColor: Colors.black,
                                onPressed: () {},
                              ),
                              content: const Text('Профиль успешно сохранен'),
                              duration: const Duration(milliseconds: 2500),
                              width: 320.0,
                              padding:
                                  const EdgeInsets.symmetric(horizontal: 7.0),
                              behavior: SnackBarBehavior.floating,
                              backgroundColor: Colors.green,
                              shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(5.0))));
                        },
                        child: Text('Сохранить',
                            style: TextStyle(color: Colors.green))),
                    SizedBox(height: 20),
                  ],
                ))
          ],
        ),
      )),
    );
  }
}
