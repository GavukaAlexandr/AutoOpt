import 'package:flutter/material.dart';

class UserProfile extends StatefulWidget {
  const UserProfile({Key? key}) : super(key: key);

  @override
  _UserProfile createState() => _UserProfile();
}

class Credentials {
  String username;
  String email;
  String phone;
  Credentials({this.username = '', this.email = '', this.phone = ''});
}

class _UserProfile extends State<UserProfile> {
  final formKey = GlobalKey<FormState>();
  final credentials = Credentials();

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
                    style: TextStyle(fontSize: 24, color: Colors.black54)),
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
                    TextFormField(
                      decoration: InputDecoration(
                        hintText: 'Имя',
                        prefixIcon: Icon(
                          Icons.person_rounded,
                          size: 28,
                        ),
                      ),
                      validator: (value) {
                        if (value!.isEmpty) {
                          return 'Поле Обязательно';
                        }
                        return null;
                      },
                      onSaved: (value) {
                        credentials.username = value!;
                      },
                    ),
                    SizedBox(height: 20),
                    TextFormField(
                      decoration: InputDecoration(
                        hintText: 'Почта',
                        prefixIcon: Icon(
                          Icons.email,
                          size: 28,
                        ),
                      ),
                      validator: (value) {
                        if (value!.isEmpty) {
                          return 'Поле  Обязательно';
                        }
                        return null;
                      },
                      onSaved: (value) {
                        credentials.email = value!;
                      },
                    ),
                    SizedBox(height: 20),
                    TextFormField(
                      decoration: InputDecoration(
                        hintText: 'Телефон',
                        prefixIcon: Icon(
                          Icons.phone_enabled,
                          size: 28,
                        ),
                      ),
                      validator: (value) {
                        if (value!.isEmpty) {
                          return 'Поле Обязательно';
                        }
                        return null;
                      },
                      onSaved: (value) {
                        credentials.phone = value!;
                      },
                    ),
                    SizedBox(height: 20),
                    OutlinedButton(
                        style: OutlinedButton.styleFrom(
                            padding: EdgeInsets.only(
                                left: 34, right: 34, top: 12, bottom: 12)),
                        onPressed: () {
                          if (formKey.currentState!.validate()) {
                            formKey.currentState!.save();
                            print(credentials.username +
                                ' and ' +
                                credentials.email +
                                'and' +
                                credentials.phone);
                          }
                        },
                        child: Text('Сохранить',
                            style: TextStyle(color: Colors.green))),
                  ],
                ))
          ],
        ),
      )),
    );
  }
}
