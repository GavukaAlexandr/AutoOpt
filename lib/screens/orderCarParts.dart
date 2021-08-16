import 'dart:async';
import 'dart:convert';
import 'package:rflutter_alert/rflutter_alert.dart';
import 'package:avto_opt/state/search_form_store.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:loading_overlay/loading_overlay.dart';
import 'package:shared_preferences/shared_preferences.dart';

class OrderCarParts extends StatefulWidget {
  const OrderCarParts({Key? key}) : super(key: key);

  @override
  _OrderCarPartsState createState() => _OrderCarPartsState();
}

class _OrderCarPartsState extends State<OrderCarParts> {
  final searchFormStore = SearchFormStore();
  var maskFormatter = new MaskTextInputFormatter(mask: "#.#");
  var currentFocus;
  var resultFrom;
  final Connectivity connectivity = Connectivity();
  Map<String, String> networkStatus = {};
  late StreamSubscription<ConnectivityResult> subscription;
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
  void checkConnectivity2() async {
    subscription =
        connectivity.onConnectivityChanged.listen((ConnectivityResult result) {
      getConnectionValue(result);
    });
  }

  dynamic getConnectionValue(var connectivityResult) {
    String status = '';
    switch (connectivityResult) {
      case ConnectivityResult.mobile:
        status = 'Mobile';
        break;
      case ConnectivityResult.wifi:
        status = 'Wi-Fi';
        break;
      case ConnectivityResult.none:
        status = 'None';
        break;
      default:
        status = 'None';
        break;
    }
    if (status == 'None') {
      return ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          key: scaffoldKey,
          content: const Text('Интернет соединение отсутствует'),
          duration: const Duration(days: 365),
        ),
      );
    } else {
      return ScaffoldMessenger.of(context).hideCurrentSnackBar();
    }
  }

  void checkProfileData() async {
    final prefs = await SharedPreferences.getInstance();
    var name = prefs.getString('userName');
    var email = prefs.getString('userEmail');
    var phoneNumber = prefs.getString('userPhone');
    var telegram = prefs.getBool('telegram');
    var phone = prefs.getBool('phone');
    var viber = prefs.getBool('viber');
    if (name == '') return alert();
    if (email == '') return alert();
    if (phoneNumber == '') return alert();
    if (telegram == false && phone == false && viber == false) return alert();
    if (telegram == null && phone == null && viber == null) return alert();
    setState(() {
      resultFrom= {
        'name': 'rostyslav',
        'email': 'ronyahavuka@gmail.com',
        'phoneNumber': '38068565277',
        'telegram': true,
        'phone': false,
        'viber': false,
        'transportType' : searchFormStore.valueTransportType,
        'brandName' : searchFormStore.valueBrand,
        'modelName' : searchFormStore.valueModel,
        'transmission' : searchFormStore.valueTransmission,
        'bodyType' : searchFormStore.valueBodyType,
        'drive' : searchFormStore.valueDrive,
        'year' : searchFormStore.year,
        'volume' : searchFormStore.volume,
        'vin' : searchFormStore.vinNumber,
        'carParts' : searchFormStore.carParts,
        'fuelType' : searchFormStore.fuelType,
        'partType' : searchFormStore.partType,
      };
    });
    print(json.encode(resultFrom));
  }

  dynamic alert() {
    return Alert(
      context: context,
      type: AlertType.warning,
      title: "Заполните пожалуйста профиль",
      buttons: [
        DialogButton(
          child: Text(
            "Закрыть",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.pop(context),
          color: Colors.red[300],
        ),
        DialogButton(
          child: Text(
            "В профиль",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => {
            Navigator.pop(context),
            Navigator.pushNamed(context, 'userProfile'),
          },
          color: Colors.green,
        )
      ],
    ).show();
  }

  unfocus() {
    currentFocus = FocusScope.of(context);
    if (!currentFocus.hasPrimaryFocus) {
      currentFocus.unfocus();
    }
  }

  @override
  void initState() {
    super.initState();
    checkConnectivity2();
    searchFormStore.getTransport();
    searchFormStore.initialBrands.add({'value': 'Марка:', 'title': 'Марка:'});
    searchFormStore.initialModels.add({'value': 'Модель:', 'title': 'Модель:'});
    searchFormStore.valueModel =
        getInitValueFromResponse(searchFormStore.initialModels, 'Модель:');
    searchFormStore.valueBrand =
        getInitValueFromResponse(searchFormStore.initialBrands, 'Марка:');
    searchFormStore.valueDrive =
        getInitValueFromResponse(searchFormStore.initialDrive, 'Привод:');
    searchFormStore.valueTransportType = getInitValueFromResponse(
        searchFormStore.initialTransportType, 'Тип транспорта:');
    searchFormStore.valueTransmission = getInitValueFromResponse(
        searchFormStore.initialTransmission, 'Коробка передач:');
    searchFormStore.valueBodyType = getInitValueFromResponse(
        searchFormStore.initialBodyType, 'Тип кузова:');
    searchFormStore.setupValidations();
  }

  @override
  void dispose() {
    searchFormStore.dispose();
    subscription.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setPreferredOrientations([
      DeviceOrientation.portraitUp,
      DeviceOrientation.portraitDown,
    ]);
    return GestureDetector(
      onTap: unfocus,
      child: Scaffold(
        appBar: AppBar(
          title: Text('Главная'),
          centerTitle: true,
          actions: [
            IconButton(
              onPressed: () {
                Navigator.pushNamed(context, 'userProfile');
              },
              icon: Icon(Icons.person),
              iconSize: 36,
            )
          ],
          backgroundColor: Colors.blueAccent,
        ),
        body: Observer(
          builder: (_) => LoadingOverlay(
            color: Colors.black54,
            isLoading: searchFormStore.loaderStatus,
            child: SafeArea(
              child: Padding(
                padding:
                    const EdgeInsets.only(left: 10.0, right: 10.0, top: 10.0),
                child: SingleChildScrollView(
                  child: Column(
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Text('Поиск запчастей',
                              style: TextStyle(
                                  fontSize: 24,
                                  color: Colors.black87,
                                  fontWeight: FontWeight.w300)),
                          SizedBox(width: 5),
                          Icon(
                            Icons.search_outlined,
                            color: Colors.black87,
                            size: 28,
                          ),
                        ],
                      ),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          Observer(
                            builder: (_) => Container(
                              child: DropdownButtonHideUnderline(
                                child: DropdownButtonFormField(
                                  decoration: InputDecoration(
                                      errorText: searchFormStore
                                          .error.valueTransportType),
                                  value: searchFormStore.valueTransportType,
                                  style: new TextStyle(
                                    fontWeight: FontWeight.w300,
                                    fontSize: 16,
                                    color: Colors.black,
                                  ),
                                  onChanged: (value) {
                                    searchFormStore.transportTypeSetValue(
                                        value.toString());
                                  },
                                  icon: Icon(
                                    Icons.keyboard_arrow_down,
                                    color: Colors.black,
                                  ),
                                  items: searchFormStore.initialTransportType
                                      .map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 6),
                          Observer(
                            builder: (_) => Container(
                              child: DropdownButtonHideUnderline(
                                child: DropdownButtonFormField(
                                  decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueBrand),
                                  value: searchFormStore.valueBrand,
                                  style: new TextStyle(
                                    fontWeight: FontWeight.w300,
                                    fontSize: 16,
                                    color: Colors.black,
                                  ),
                                  onChanged: (value) {
                                    searchFormStore
                                        .brandSetValue(value.toString());
                                  },
                                  icon: Icon(
                                    Icons.keyboard_arrow_down,
                                    color: Colors.black,
                                  ),
                                  items:
                                      searchFormStore.initialBrands.map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 6),
                          Observer(
                            builder: (_) => Container(
                              child: DropdownButtonHideUnderline(
                                child: DropdownButtonFormField(
                                  decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueModel),
                                  value: searchFormStore.valueModel,
                                  style: new TextStyle(
                                    fontWeight: FontWeight.w300,
                                    fontSize: 16,
                                    color: Colors.black,
                                  ),
                                  onChanged: (value) {
                                    searchFormStore
                                        .modelSetValue(value.toString());
                                  },
                                  icon: Icon(
                                    Icons.keyboard_arrow_down,
                                    color: Colors.black,
                                  ),
                                  items:
                                      searchFormStore.initialModels.map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 6),
                          Observer(
                            builder: (_) => Container(
                              child: DropdownButtonHideUnderline(
                                child: DropdownButtonFormField(
                                  decoration: InputDecoration(
                                      errorText: searchFormStore
                                          .error.valueTransmission),
                                  value: searchFormStore.valueTransmission,
                                  style: new TextStyle(
                                    fontWeight: FontWeight.w300,
                                    fontSize: 16,
                                    color: Colors.black,
                                  ),
                                  onChanged: (value) {
                                    setState(() {
                                      searchFormStore.transmissionSetValue(
                                          value.toString());
                                    });
                                  },
                                  icon: Icon(
                                    Icons.keyboard_arrow_down,
                                    color: Colors.black,
                                  ),
                                  items: searchFormStore.initialTransmission
                                      .map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 6),
                          Observer(
                            builder: (_) => Container(
                              child: DropdownButtonHideUnderline(
                                child: DropdownButtonFormField(
                                  decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueBodyType),
                                  style: new TextStyle(
                                    fontWeight: FontWeight.w300,
                                    fontSize: 16,
                                    color: Colors.black,
                                  ),
                                  value: searchFormStore.valueBodyType,
                                  onChanged: (value) {
                                    searchFormStore
                                        .bodyTypeSetValue(value.toString());
                                  },
                                  icon: Icon(
                                    Icons.keyboard_arrow_down,
                                    color: Colors.black,
                                  ),
                                  items: searchFormStore.initialBodyType
                                      .map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                              ),
                            ),
                          ),
                          SizedBox(height: 6),
                          Observer(
                            builder: (_) => Container(
                              child: DropdownButtonHideUnderline(
                                child: DropdownButtonFormField(
                                  decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueDrive),
                                  style: new TextStyle(
                                    fontWeight: FontWeight.w300,
                                    fontSize: 16,
                                    color: Colors.black,
                                  ),
                                  value: searchFormStore.valueDrive,
                                  onChanged: (value) {
                                    searchFormStore
                                        .driveSetValue(value.toString());
                                  },
                                  icon: Icon(
                                    Icons.keyboard_arrow_down,
                                    color: Colors.black,
                                  ),
                                  items:
                                      searchFormStore.initialDrive.map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      Container(
                          child: Column(
                        children: <Widget>[
                          Row(
                            children: <Widget>[
                              Observer(
                                builder: (_) => Flexible(
                                  flex: 1,
                                  fit: FlexFit.tight,
                                  child: Container(
                                    child: TextFormField(
                                        keyboardType: TextInputType.number,
                                        maxLength: 4,
                                        decoration: InputDecoration(
                                            counterText: "",
                                            errorText:
                                                searchFormStore.error.year,
                                            labelText: 'Год выпуска :',
                                            labelStyle: TextStyle(
                                                fontSize: 16,
                                                fontWeight: FontWeight.w300)),
                                        onChanged: (String value) {
                                          searchFormStore.year = value;
                                        }),
                                  ),
                                ),
                              ),
                              SizedBox(
                                width: 5,
                              ),
                              Observer(
                                builder: (_) => Flexible(
                                  flex: 1,
                                  fit: FlexFit.loose,
                                  child: Container(
                                    child: TextFormField(
                                        inputFormatters: [maskFormatter],
                                        keyboardType: TextInputType.number,
                                        maxLength: 3,
                                        decoration: InputDecoration(
                                          counterText: "",
                                          errorText:
                                              searchFormStore.error.volume,
                                          labelText: 'Объем двигателя :',
                                          labelStyle: TextStyle(
                                              fontSize: 16,
                                              fontWeight: FontWeight.w300),
                                        ),
                                        onChanged: (String value) {
                                          searchFormStore.volume = value;
                                        }),
                                  ),
                                ),
                              )
                            ],
                            mainAxisAlignment: MainAxisAlignment.center,
                          ),
                        ],
                      )),
                      Observer(
                          builder: (_) => TextFormField(
                              keyboardType: TextInputType.number,
                              decoration: InputDecoration(
                                  errorText: searchFormStore.error.vinNumber,
                                  labelText: 'V I N номер :',
                                  labelStyle: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w300)),
                              onChanged: (String value) {
                                searchFormStore.vinNumber = value;
                              })),
                      Observer(
                          builder: (_) => TextFormField(
                              keyboardType: TextInputType.multiline,
                              maxLines: null,
                              decoration: InputDecoration(
                                  errorText: searchFormStore.error.carParts,
                                  labelText: 'Запчасти (наим/кат.номер) :',
                                  labelStyle: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w300)),
                              onChanged: (String value) {
                                searchFormStore.carParts = value;
                              })),
                      SizedBox(
                        height: 5,
                      ),
                      Observer(
                        builder: (_) => Container(
                          decoration: searchFormStore.error.fuel != null
                              ? BoxDecoration(color: Colors.red[300])
                              : BoxDecoration(color: Colors.grey[200]),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              Text('Тип топлива',
                                  style: TextStyle(
                                      fontSize: 18,
                                      color: Colors.black87,
                                      fontWeight: FontWeight.w300)),
                              SizedBox(width: 5),
                              Icon(
                                Icons.local_gas_station_outlined,
                                color: Colors.black87,
                                size: 22,
                              ),
                            ],
                          ),
                        ),
                      ),
                      Observer(
                        builder: (_) => Container(
                          width: MediaQuery.of(context).size.width,
                          alignment: Alignment.center,
                          child: (searchFormStore.error.fuel != null
                              ? Text(
                                  searchFormStore.error.fuel.toString(),
                                  style: TextStyle(color: Colors.red),
                                )
                              : SizedBox(
                                  width: 1,
                                )),
                        ),
                      ),
                      Observer(
                        builder: (_) => GridView.count(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          childAspectRatio: 8,
                          crossAxisCount: 1,
                          children: searchFormStore.fuelType.keys.map(
                            (key) {
                              return Container(
                                  child: SwitchListTile(
                                inactiveTrackColor:
                                    searchFormStore.error.fuel != null
                                        ? Colors.red[300]
                                        : Colors.grey[200],
                                title: Text(
                                  key,
                                  style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.w300),
                                ),
                                value: searchFormStore.fuelType[key],
                                onChanged: (value) {
                                  searchFormStore.changeFuelType(key, value);
                                },
                              ));
                            },
                          ).toList(),
                        ),
                      ),
                      SizedBox(
                        height: 5,
                      ),
                      Container(
                        decoration: searchFormStore.error.partType != null
                            ? BoxDecoration(color: Colors.red[300])
                            : BoxDecoration(color: Colors.grey[200]),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('Тип запчасти',
                                style: TextStyle(
                                    fontSize: 18,
                                    color: Colors.black87,
                                    fontWeight: FontWeight.w300)),
                            SizedBox(width: 5),
                            Icon(
                              Icons.build_outlined,
                              color: Colors.black87,
                              size: 22,
                            ),
                          ],
                        ),
                      ),
                      Observer(
                        builder: (_) => Container(
                          width: MediaQuery.of(context).size.width,
                          alignment: Alignment.center,
                          child: (searchFormStore.error.partType != null
                              ? Text(
                                  searchFormStore.error.partType.toString(),
                                  style: TextStyle(color: Colors.red),
                                )
                              : SizedBox(
                                  width: 1,
                                )),
                        ),
                      ),
                      Observer(
                        builder: (_) => GridView.count(
                          shrinkWrap: true,
                          physics: NeverScrollableScrollPhysics(),
                          childAspectRatio: 8,
                          crossAxisCount: 1,
                          children: searchFormStore.partType.keys.map((key) {
                            return Container(
                                child: SwitchListTile(
                              inactiveTrackColor:
                                  searchFormStore.error.partType != null
                                      ? Colors.red[300]
                                      : Colors.grey[200],
                              title: Text(
                                key,
                                style: TextStyle(
                                    fontSize: 20, fontWeight: FontWeight.w300),
                              ),
                              value: searchFormStore.partType[key],
                              onChanged: (value) {
                                searchFormStore.changePartType(key, value);
                              },
                            ));
                          }).toList(),
                        ),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                      Container(
                        width: MediaQuery.of(context).size.width * 0.62,
                        child: OutlinedButton(
                          style: OutlinedButton.styleFrom(
                              backgroundColor: Colors.green[300],
                              padding: EdgeInsets.only(
                                  left: 34, right: 34, top: 12, bottom: 12)),
                          onPressed: () {
                            searchFormStore.validateAll();
                            if (!searchFormStore.error.hasErrors) return checkProfileData();
                            Alert(
                              context: context,
                              type: AlertType.error,
                              title:
                                  "Проверьте правильность заполненных данных",
                              buttons: [
                                DialogButton(
                                  child: Text(
                                    "Закрыть",
                                    style: TextStyle(
                                        color: Colors.white, fontSize: 16),
                                  ),
                                  onPressed: () => Navigator.pop(context),
                                  color: Colors.red[300],
                                ),
                              ],
                            ).show();
                          },
                          child: Text(
                            'Отправить',
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 19,
                                fontWeight: FontWeight.w300),
                          ),
                        ),
                      ),
                      SizedBox(
                        height: 20,
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
