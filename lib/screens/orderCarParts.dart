import 'dart:async';
import 'dart:convert';
import 'package:avto_opt/generated/l10n.dart';
import 'package:avto_opt/screens/login.dart';
import 'package:avto_opt/state/user_form_store.dart';
import 'package:dio/dio.dart';
import 'package:mobx/mobx.dart';
import 'package:rflutter_alert/rflutter_alert.dart';
import 'package:avto_opt/state/search_form_store.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:loading_overlay/loading_overlay.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';

class OrderCarParts extends StatefulWidget {
  const OrderCarParts({Key? key}) : super(key: key);

  @override
  _OrderCarPartsState createState() => _OrderCarPartsState();
}

class _OrderCarPartsState extends State<OrderCarParts> {
  final searchFormStore = SearchFormStore();
  var maskFormatter = new MaskTextInputFormatter(mask: "#.#");
  var currentFocus;
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

  dynamic alertSuccess() {
    return Alert(
      context: context,
      type: AlertType.success,
      title: "Заказ успешно принят",
      buttons: [
        DialogButton(
          child: Text(
            "Закрыть",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.pop(context),
          color: Colors.red[100],
        ),
      ],
    ).show();
  }

  unfocus() {
    currentFocus = FocusScope.of(context);
    if (!currentFocus.hasPrimaryFocus) {
      currentFocus.unfocus();
    }
  }

  isToken() async {
    final prefs = await SharedPreferences.getInstance();
    var token = prefs.getString('token');

    if (token != null) return;
    Navigator.pushAndRemoveUntil(
      context,
      MaterialPageRoute(builder: (context) => Login()),
      (Route<dynamic> route) => false,
    );
  }

  @override
  void initState() {
    super.initState();
    isToken();
    checkConnectivity2();

    searchFormStore.getTransport();
    searchFormStore.initialModels.add({'value': 'Модель:', 'title': 'Модель:'});
    searchFormStore.valueModel =
        getInitValueFromResponse(searchFormStore.initialModels, 'Модель:');
    searchFormStore.valueDrive =
        getInitValueFromResponse(searchFormStore.initialDrive, 'Привод:');
    // searchFormStore.valueTransportType = getInitValueFromResponse(
    //     searchFormStore.initialTransportType, 'Тип транспорта:');
    searchFormStore.valueTransmission = getInitValueFromResponse(
        searchFormStore.initialTransmission, 'Коробка передач:');
    searchFormStore.valueBodyType = getInitValueFromResponse(
        searchFormStore.initialBodyType, 'Тип кузова:');
    searchFormStore.setupValidations();
  }

  Future _refresh() => searchFormStore.getTransport();

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
          title: Text(S.of(context).order_app_bar,
              style: TextStyle(
                  letterSpacing: 1, fontFamily: 'Montserrat', fontSize: 18.sp)),
          centerTitle: true,
          backgroundColor: Theme.of(context).primaryColor,
          elevation: 0.0,
          actions: [
            IconButton(
              onPressed: () async {
                Navigator.pushNamed(context, 'userProfile');
              },
              icon: Icon(Icons.person_outline_outlined),
              iconSize: 36.sp,
            )
          ],
        ),
        body: Observer(
          builder: (_) => LoadingOverlay(
              color: Colors.black54,
              isLoading: searchFormStore.loaderStatus,
              child: Center(
                child: Container(
                  width: 1.sw,
                  padding: EdgeInsets.only(
                      left: 10.0, right: 10.0, top: 10, bottom: 10),
                  child: Column(
                    children: [
                      Observer(builder: (_) {
                        final future = searchFormStore.initialTransportType;

                        if (future == null) {
                          return const CircularProgressIndicator();
                        }

                        switch (future.status) {
                          case FutureStatus.pending:
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: const [
                                CircularProgressIndicator(),
                                Text('Loading items...'),
                              ],
                            );

                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                const Text(
                                  'Failed to load items.',
                                  style: TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child: const Text('Tap to try again'),
                                  onPressed: _refresh,
                                )
                              ],
                            );

                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            searchFormStore.valueTransportType =
                                items[0]['value'];
                            return Container(
                              child: DropdownButtonFormField(
                                decoration: InputDecoration(
                                  labelText: 'Тип транспорта:',
                                  hintText: 'Выберите тип транспорта',
                                  labelStyle: TextStyle(
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 1,
                                      fontSize: 16.sp),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(18.0),
                                  ),
                                  contentPadding:
                                      EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
                                ),
                                value: searchFormStore.valueTransportType,
                                style: TextStyle(
                                    letterSpacing: 1,
                                    fontWeight: FontWeight.w400,
                                    fontSize: 16.sp,
                                    fontFamily: 'Montserrat',
                                    color: Theme.of(context)
                                        .textTheme
                                        .bodyText1
                                        ?.color),
                                onTap: () {
                                  print('open');
                                },
                                onChanged: (value) {
                                  searchFormStore
                                      .transportTypeSetValue(value.toString());
                                },
                                icon: Icon(
                                  Icons.keyboard_arrow_down_outlined,
                                ),
                                items: items.map((map) {
                                  return DropdownMenuItem<String>(
                                      value: map['value'],
                                      child: Text(map['title']));
                                }).toList(),
                              ),
                            );
                        }
                      }),
                      SizedBox(height: 10),
                      Observer(builder: (_) {
                        final future = searchFormStore.initialBrands;

                        if (future == null) {
                          return Container(
                            child: DropdownButtonFormField(
                              decoration: InputDecoration(
                                labelText: 'Марка:',
                                labelStyle: TextStyle(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 1,
                                    fontSize: 16.sp),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(18.0),
                                ),
                                contentPadding:
                                    EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
                              ),
                              value: 'Выберите тип транспорта',
                              style: TextStyle(
                                  letterSpacing: 1,
                                  fontWeight: FontWeight.w400,
                                  fontSize: 16.sp,
                                  fontFamily: 'Montserrat',
                                  color: Theme.of(context)
                                      .textTheme
                                      .bodyText1
                                      ?.color),
                              icon: Icon(
                                Icons.keyboard_arrow_down_outlined,
                              ),
                              items: <dynamic>[
                                {
                                  'value': 'Выберите тип транспорта',
                                  'title': 'Выберите тип транспорта'
                                }
                              ].map((map) {
                                return DropdownMenuItem<String>(
                                    value: map['value'],
                                    child: Text(map['title']));
                              }).toList(),
                            ),
                          );
                        }

                        switch (future.status) {
                          case FutureStatus.pending:
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: const [
                                CircularProgressIndicator(),
                                Text('Loading items...'),
                              ],
                            );

                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                const Text(
                                  'Failed to load items.',
                                  style: TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child: const Text('Tap to try again'),
                                  onPressed: _refresh,
                                )
                              ],
                            );

                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            searchFormStore.valueBrand = items[0]['value'];
                            return Container(
                              child: DropdownButtonFormField(
                                decoration: InputDecoration(
                                  labelText: 'Марка:',
                                  labelStyle: TextStyle(
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 1,
                                      fontSize: 16.sp),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(18.0),
                                  ),
                                  contentPadding:
                                      EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
                                ),
                                value: searchFormStore.valueBrand,
                                style: TextStyle(
                                    letterSpacing: 1,
                                    fontWeight: FontWeight.w400,
                                    fontSize: 16.sp,
                                    fontFamily: 'Montserrat',
                                    color: Theme.of(context)
                                        .textTheme
                                        .bodyText1
                                        ?.color),
                                onChanged: (value) {
                                  searchFormStore
                                      .brandSetValue(value.toString());
                                },
                                icon: Icon(
                                  Icons.keyboard_arrow_down_outlined,
                                ),
                                items: items.map((map) {
                                  return DropdownMenuItem<String>(
                                      value: map['value'],
                                      child: Text(map['title']));
                                }).toList(),
                              ),
                            );
                        }
                      }),
                      SizedBox(height: 10),
                      Observer(
                        builder: (_) => Container(
                          child: DropdownButtonFormField(
                            decoration: InputDecoration(
                                labelText: 'Модель:',
                                labelStyle: TextStyle(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 1,
                                    fontSize: 16.sp),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(18.0),
                                ),
                                contentPadding:
                                    EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
                                errorText: searchFormStore.error.valueModel),
                            value: searchFormStore.valueModel,
                            style: TextStyle(
                                letterSpacing: 1,
                                fontWeight: FontWeight.w400,
                                fontSize: 16.sp,
                                fontFamily: 'Montserrat',
                                color: Theme.of(context)
                                    .textTheme
                                    .bodyText1
                                    ?.color),
                            onChanged: (value) {
                              searchFormStore.modelSetValue(value.toString());
                            },
                            icon: Icon(
                              Icons.keyboard_arrow_down,
                            ),
                            items: searchFormStore.initialModels.map((map) {
                              return DropdownMenuItem<String>(
                                  value: map['value'],
                                  child: Text(map['title']));
                            }).toList(),
                          ),
                        ),
                      ),
                      SizedBox(height: 10),
                      Observer(
                        builder: (_) => Container(
                          child: DropdownButtonFormField(
                            decoration: InputDecoration(
                                labelText: 'Коробка передач:',
                                labelStyle: TextStyle(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 1,
                                    fontSize: 16.sp),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(18.0),
                                ),
                                contentPadding:
                                    EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
                                errorText:
                                    searchFormStore.error.valueTransmission),
                            value: searchFormStore.valueTransmission,
                            style: TextStyle(
                                letterSpacing: 1,
                                fontWeight: FontWeight.w400,
                                fontSize: 16.sp,
                                fontFamily: 'Montserrat',
                                color: Theme.of(context)
                                    .textTheme
                                    .bodyText1
                                    ?.color),
                            onChanged: (value) {
                              setState(() {
                                searchFormStore
                                    .transmissionSetValue(value.toString());
                              });
                            },
                            icon: Icon(
                              Icons.keyboard_arrow_down,
                            ),
                            items:
                                searchFormStore.initialTransmission.map((map) {
                              return DropdownMenuItem<String>(
                                  value: map['value'],
                                  child: Text(map['title']));
                            }).toList(),
                          ),
                        ),
                      ),
                      SizedBox(height: 10),
                      Observer(
                        builder: (_) => Container(
                          child: DropdownButtonFormField(
                            decoration: InputDecoration(
                                labelText: 'Тип кузова:',
                                labelStyle: TextStyle(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 1,
                                    fontSize: 16.sp),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(18.0),
                                ),
                                contentPadding:
                                    EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
                                errorText: searchFormStore.error.valueBodyType),
                            style: TextStyle(
                                letterSpacing: 1,
                                fontWeight: FontWeight.w400,
                                fontSize: 16.sp,
                                fontFamily: 'Montserrat',
                                color: Theme.of(context)
                                    .textTheme
                                    .bodyText1
                                    ?.color),
                            value: searchFormStore.valueBodyType,
                            onChanged: (value) {
                              searchFormStore
                                  .bodyTypeSetValue(value.toString());
                            },
                            icon: Icon(
                              Icons.keyboard_arrow_down,
                            ),
                            items: searchFormStore.initialBodyType.map((map) {
                              return DropdownMenuItem<String>(
                                  value: map['value'],
                                  child: Text(map['title']));
                            }).toList(),
                          ),
                        ),
                      ),
                      SizedBox(height: 10),
                      Observer(
                        builder: (_) => Container(
                          child: DropdownButtonFormField(
                            decoration: InputDecoration(
                                labelText: 'Привод:',
                                labelStyle: TextStyle(
                                    fontFamily: 'Montserrat',
                                    letterSpacing: 1,
                                    fontSize: 16.sp),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(18.0),
                                ),
                                contentPadding:
                                    EdgeInsets.fromLTRB(10.0, 0, 10.0, 0),
                                errorText: searchFormStore.error.valueDrive),
                            value: searchFormStore.valueDrive,
                            style: TextStyle(
                                letterSpacing: 1,
                                fontWeight: FontWeight.w400,
                                fontSize: 16.sp,
                                fontFamily: 'Montserrat',
                                color: Theme.of(context)
                                    .textTheme
                                    .bodyText1
                                    ?.color),
                            onChanged: (value) {
                              searchFormStore.driveSetValue(value.toString());
                            },
                            icon: Icon(
                              Icons.keyboard_arrow_down_outlined,
                            ),
                            items: searchFormStore.initialDrive.map((map) {
                              return DropdownMenuItem<String>(
                                  value: map['value'],
                                  child: Text(map['title']));
                            }).toList(),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              )),
        ),
      ),
    );
  }
}

//                           Observer(
//                             builder: (_) => Container(
//                               child: DropdownButtonHideUnderline(
//                                 child: DropdownButtonFormField(
//                                   decoration: InputDecoration(
//                                       errorText:
//                                           searchFormStore.error.valueDrive),
//                                   style: new TextStyle(
//                                     fontWeight: FontWeight.w300,
//                                     fontSize: 16,
//                                     color: Colors.black,
//                                   ),
//                                   value: searchFormStore.valueDrive,
//                                   onChanged: (value) {
//                                     searchFormStore
//                                         .driveSetValue(value.toString());
//                                   },
//                                   icon: Icon(
//                                     Icons.keyboard_arrow_down,
//                                     color: Colors.black,
//                                   ),
//                                   items:
//                                       searchFormStore.initialDrive.map((map) {
//                                     return DropdownMenuItem<String>(
//                                         value: map['value'],
//                                         child: Text(map['title']));
//                                   }).toList(),
//                                 ),
//                               ),
//                             ),
//                           ),
//                         ],
//                       ),
//                       Container(
//                           child: Column(
//                         children: <Widget>[
//                           Row(
//                             children: <Widget>[
//                               Observer(
//                                 builder: (_) => Flexible(
//                                   flex: 1,
//                                   fit: FlexFit.tight,
//                                   child: Container(
//                                     child: TextFormField(
//                                         keyboardType: TextInputType.number,
//                                         maxLength: 4,
//                                         decoration: InputDecoration(
//                                             counterText: "",
//                                             errorText:
//                                                 searchFormStore.error.year,
//                                             labelText: 'Год выпуска :',
//                                             labelStyle: TextStyle(
//                                                 fontSize: 16,
//                                                 fontWeight: FontWeight.w300)),
//                                         onChanged: (String value) {
//                                           searchFormStore.year = value;
//                                         }),
//                                   ),
//                                 ),
//                               ),
//                               SizedBox(
//                                 width: 5,
//                               ),
//                               Observer(
//                                 builder: (_) => Flexible(
//                                   flex: 1,
//                                   fit: FlexFit.loose,
//                                   child: Container(
//                                     child: TextFormField(
//                                         inputFormatters: [maskFormatter],
//                                         keyboardType: TextInputType.number,
//                                         maxLength: 3,
//                                         decoration: InputDecoration(
//                                           counterText: "",
//                                           errorText:
//                                               searchFormStore.error.volume,
//                                           labelText: 'Объем двигателя :',
//                                           labelStyle: TextStyle(
//                                               fontSize: 16,
//                                               fontWeight: FontWeight.w300),
//                                         ),
//                                         onChanged: (String value) {
//                                           searchFormStore.volume = value;
//                                         }),
//                                   ),
//                                 ),
//                               )
//                             ],
//                             mainAxisAlignment: MainAxisAlignment.center,
//                           ),
//                         ],
//                       )),
//                       Observer(
//                           builder: (_) => TextFormField(
//                               keyboardType: TextInputType.number,
//                               decoration: InputDecoration(
//                                   errorText: searchFormStore.error.vinNumber,
//                                   labelText: 'V I N номер :',
//                                   labelStyle: TextStyle(
//                                       fontSize: 16,
//                                       fontWeight: FontWeight.w300)),
//                               onChanged: (String value) {
//                                 searchFormStore.vinNumber = value;
//                               })),
//                       Observer(
//                           builder: (_) => TextFormField(
//                               keyboardType: TextInputType.multiline,
//                               maxLines: null,
//                               decoration: InputDecoration(
//                                   errorText: searchFormStore.error.carParts,
//                                   labelText: 'Запчасти (наим/кат.номер) :',
//                                   labelStyle: TextStyle(
//                                       fontSize: 16,
//                                       fontWeight: FontWeight.w300)),
//                               onChanged: (String value) {
//                                 searchFormStore.carParts = value;
//                               })),
//                       SizedBox(
//                         height: 5,
//                       ),
//                       Observer(
//                         builder: (_) => Container(
//                           decoration: searchFormStore.error.fuel != null
//                               ? BoxDecoration(color: Colors.red[300])
//                               : BoxDecoration(color: Colors.grey[200]),
//                           child: Row(
//                             mainAxisAlignment: MainAxisAlignment.center,
//                             children: [
//                               Text('Тип топлива',
//                                   style: TextStyle(
//                                       fontSize: 18,
//                                       color: Colors.black87,
//                                       fontWeight: FontWeight.w300)),
//                               SizedBox(width: 5),
//                               Icon(
//                                 Icons.local_gas_station_outlined,
//                                 color: Colors.black87,
//                                 size: 22,
//                               ),
//                             ],
//                           ),
//                         ),
//                       ),
//                       Observer(
//                         builder: (_) => Container(
//                           width: MediaQuery.of(context).size.width,
//                           alignment: Alignment.center,
//                           child: (searchFormStore.error.fuel != null
//                               ? Text(
//                                   searchFormStore.error.fuel.toString(),
//                                   style: TextStyle(color: Colors.red),
//                                 )
//                               : SizedBox(
//                                   width: 1,
//                                 )),
//                         ),
//                       ),
//                       Observer(
//                         builder: (_) => GridView.count(
//                           shrinkWrap: true,
//                           physics: NeverScrollableScrollPhysics(),
//                           childAspectRatio: 8,
//                           crossAxisCount: 1,
//                           children: searchFormStore.fuelType.keys.map(
//                             (key) {
//                               return Container(
//                                   child: SwitchListTile(
//                                 inactiveTrackColor:
//                                     searchFormStore.error.fuel != null
//                                         ? Colors.red[300]
//                                         : Colors.grey[200],
//                                 title: Text(
//                                   key,
//                                   style: TextStyle(
//                                       fontSize: 20,
//                                       fontWeight: FontWeight.w300),
//                                 ),
//                                 value: searchFormStore.fuelType[key],
//                                 onChanged: (value) {
//                                   searchFormStore.changeFuelType(key, value);
//                                 },
//                               ));
//                             },
//                           ).toList(),
//                         ),
//                       ),
//                       SizedBox(
//                         height: 5,
//                       ),
//                       Container(
//                         decoration: searchFormStore.error.partType != null
//                             ? BoxDecoration(color: Colors.red[300])
//                             : BoxDecoration(color: Colors.grey[200]),
//                         child: Row(
//                           mainAxisAlignment: MainAxisAlignment.center,
//                           children: [
//                             Text('Тип запчасти',
//                                 style: TextStyle(
//                                     fontSize: 18,
//                                     color: Colors.black87,
//                                     fontWeight: FontWeight.w300)),
//                             SizedBox(width: 5),
//                             Icon(
//                               Icons.build_outlined,
//                               color: Colors.black87,
//                               size: 22,
//                             ),
//                           ],
//                         ),
//                       ),
//                       Observer(
//                         builder: (_) => Container(
//                           width: MediaQuery.of(context).size.width,
//                           alignment: Alignment.center,
//                           child: (searchFormStore.error.partType != null
//                               ? Text(
//                                   searchFormStore.error.partType.toString(),
//                                   style: TextStyle(color: Colors.red),
//                                 )
//                               : SizedBox(
//                                   width: 1,
//                                 )),
//                         ),
//                       ),
//                       Observer(
//                         builder: (_) => GridView.count(
//                           shrinkWrap: true,
//                           physics: NeverScrollableScrollPhysics(),
//                           childAspectRatio: 8,
//                           crossAxisCount: 1,
//                           children: searchFormStore.partType.keys.map((key) {
//                             return Container(
//                                 child: SwitchListTile(
//                               inactiveTrackColor:
//                                   searchFormStore.error.partType != null
//                                       ? Colors.red[300]
//                                       : Colors.grey[200],
//                               title: Text(
//                                 key,
//                                 style: TextStyle(
//                                     fontSize: 20, fontWeight: FontWeight.w300),
//                               ),
//                               value: searchFormStore.partType[key],
//                               onChanged: (value) {
//                                 searchFormStore.changePartType(key, value);
//                               },
//                             ));
//                           }).toList(),
//                         ),
//                       ),
//                       SizedBox(
//                         height: 20,
//                       ),
//                       Container(
//                         width: MediaQuery.of(context).size.width * 0.62,
//                         child: OutlinedButton(
//                           style: OutlinedButton.styleFrom(
//                               backgroundColor: Colors.green[300],
//                               padding: EdgeInsets.only(
//                                   left: 34, right: 34, top: 12, bottom: 12)),
//                           onPressed: () {
//                             searchFormStore.validateAll();
//                             if (!searchFormStore.error.hasErrors)
//                               return checkProfileData();
//                             Alert(
//                               context: context,
//                               type: AlertType.error,
//                               title:
//                                   "Проверьте правильность заполненных данных",
//                               buttons: [
//                                 DialogButton(
//                                   child: Text(
//                                     "Закрыть",
//                                     style: TextStyle(
//                                         color: Colors.white, fontSize: 16),
//                                   ),
//                                   onPressed: () => Navigator.pop(context),
//                                   color: Colors.red[300],
//                                 ),
//                               ],
//                             ).show();
//                           },
//                           child: Text(
//                             'Отправить',
//                             style: TextStyle(
//                                 color: Colors.white,
//                                 fontSize: 19,
//                                 fontWeight: FontWeight.w300),
//                           ),
//                         ),
//                       ),
//                       SizedBox(
//                         height: 20,
//                       ),
//                     ],
//                   ),
//                 ),
//               ),
//             ),
