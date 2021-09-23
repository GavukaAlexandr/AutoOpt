import 'dart:async';
import 'package:mobx/mobx.dart';
import 'package:rflutter_alert/rflutter_alert.dart';
import 'package:avto_opt/state/search_form_store.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:mask_text_input_formatter/mask_text_input_formatter.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:easy_localization/easy_localization.dart';

class OrderCarParts extends StatefulWidget {
  const OrderCarParts({Key? key}) : super(key: key);

  @override
  _OrderCarPartsState createState() => _OrderCarPartsState();
}

class _OrderCarPartsState extends State<OrderCarParts> {
  final searchFormStore = SearchFormStore();
  var currentFocus;
  final Connectivity connectivity = Connectivity();
  late StreamSubscription<ConnectivityResult> subscription;
  final GlobalKey<ScaffoldState> scaffoldKey = GlobalKey<ScaffoldState>();
  String? dropDown = '';
  bool currentConnectionStatus = false;
  MaskTextInputFormatter maskFormatter =
      MaskTextInputFormatter(mask: "#.#");

  void checkConnectivity2() async {
    subscription =
        connectivity.onConnectivityChanged.listen((ConnectivityResult result) {
      getConnectionValue(result);
    });
  }

  getConnectionValue(var connectivityResult) {
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
      setState(() {
        currentConnectionStatus = false;
      });
    } else {
      setState(() {
        currentConnectionStatus = true;
        searchFormStore.getTransport();
      });
    }
  }

  alertSuccess() {
    return Alert(
      style: const AlertStyle(backgroundColor: Colors.white),
      context: context,
      type: AlertType.success,
      title: "Заказ успешно принят",
      buttons: [
        DialogButton(
          child: const Text(
            "Закрыть",
            style: TextStyle(color: Colors.white, fontSize: 16),
          ),
          onPressed: () => Navigator.pop(context),
          color: Colors.red,
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

  @override
  void initState() {
    super.initState();
    checkConnectivity2();
    searchFormStore.setupValidations();
    searchFormStore.yearController.addListener(() {
      searchFormStore.year = searchFormStore.yearController.text.toString();
    });
    searchFormStore.engineVolumeController.addListener(() {
      searchFormStore.volume =
          searchFormStore.engineVolumeController.text.toString();
    });
    searchFormStore.vinNumberController.addListener(() {
      searchFormStore.vinNumber =
          searchFormStore.vinNumberController.text.toString();
    });
    searchFormStore.carPartsController.addListener(() {
      searchFormStore.carParts =
          searchFormStore.carPartsController.text.toString();
    });
    searchFormStore.getOrder();
  }

  Future _refresh() => searchFormStore.getTransport();

  @override
  void dispose() {
    searchFormStore.dispose();
    searchFormStore.yearController.dispose();
    searchFormStore.engineVolumeController.dispose();
    searchFormStore.vinNumberController.dispose();
    searchFormStore.carPartsController.dispose();
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
      child: currentConnectionStatus
          ? Scaffold(
              appBar: AppBar(
                title: Text('order_app_bar'.tr(),
                    style: TextStyle(
                        letterSpacing: 1.sp,
                        fontFamily: 'Montserrat',
                        fontSize: 18.sp)),
                centerTitle: true,
                backgroundColor: Theme.of(context).primaryColor,
                elevation: 0.0,
                actions: [
                  IconButton(
                    onPressed: () {
                      Navigator.pushNamed(context, 'userProfile');
                    },
                    icon: const Icon(Icons.person_rounded),
                    iconSize: 30.sp,
                  )
                ],
              ),
              body: SingleChildScrollView(
                child: Container(
                  width: 1.sw,
                  padding: EdgeInsets.only(
                      left: 10.sp, right: 10.sp, top: 10.sp, bottom: 10.sp),
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
                              children: [
                                const CircularProgressIndicator(),
                                Text('order_loading'.tr()),
                              ],
                            );
                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Text(
                                  'order_dropdown_error'.tr(),
                                  style: const TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child:
                                      Text('order_button_retry_request'.tr()),
                                  onPressed: _refresh,
                                )
                              ],
                            );
                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            if (searchFormStore.valueTransportType != '') {
                              return Column(
                                children: [
                                  DropdownButtonFormField(
                                    value: searchFormStore.valueTransportType,
                                    decoration: InputDecoration(
                                      labelText: 'order_transport_type'.tr(),
                                      errorText: searchFormStore
                                          .error.valueTransportType,
                                      labelStyle: TextStyle(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 1.sp,
                                          fontSize: 16.sp),
                                      border: OutlineInputBorder(
                                        borderRadius:
                                            BorderRadius.circular(18.r),
                                      ),
                                      contentPadding: EdgeInsets.fromLTRB(
                                          5.sp, 5.sp, 5.sp, 5.sp),
                                    ),
                                    style: TextStyle(
                                        letterSpacing: 1.sp,
                                        fontWeight: FontWeight.w400,
                                        fontSize: 16.sp,
                                        fontFamily: 'Montserrat',
                                        color: Theme.of(context)
                                            .textTheme
                                            .bodyText1
                                            ?.color),
                                    onChanged: (value) {
                                      searchFormStore.transportTypeSetValue(
                                          value.toString());
                                    },
                                    icon:const  Icon(
                                      Icons.keyboard_arrow_down_outlined,
                                    ),
                                    items: items.map((map) {
                                      return DropdownMenuItem<String>(
                                          value: map['value'],
                                          child: Text(map['title']).tr());
                                    }).toList(),
                                  ),
                                  SizedBox(height: 10.h),
                                ],
                              );
                            }
                            return Column(
                              children: [
                                DropdownButtonFormField(
                                  decoration: InputDecoration(
                                    labelText: 'order_transport_type'.tr(),
                                    errorText: searchFormStore
                                        .error.valueTransportType,
                                    labelStyle: TextStyle(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 1.sp,
                                        fontSize: 16.sp),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(18.r),
                                    ),
                                    contentPadding: EdgeInsets.fromLTRB(
                                        5.sp, 5.sp, 5.sp, 5.sp),
                                  ),
                                  style: TextStyle(
                                      letterSpacing: 1.sp,
                                      fontWeight: FontWeight.w400,
                                      fontSize: 16.sp,
                                      fontFamily: 'Montserrat',
                                      color: Theme.of(context)
                                          .textTheme
                                          .bodyText1
                                          ?.color),
                                  onChanged: (value) {
                                    searchFormStore.transportTypeSetValue(
                                        value.toString());
                                  },
                                  icon: const Icon(
                                    Icons.keyboard_arrow_down_outlined,
                                  ),
                                  items: items.map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']).tr());
                                  }).toList(),
                                ),
                                SizedBox(height: 10.h),
                              ],
                            );
                        }
                      }),
                      Observer(builder: (_) {
                        final future = searchFormStore.initialBrands;

                        if (future == null) {
                          return const SizedBox.shrink();
                        }

                        switch (future.status) {
                          case FutureStatus.pending:
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                const CircularProgressIndicator(),
                                Text('order_loading'.tr()),
                              ],
                            );

                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Text(
                                  'order_dropdown_error'.tr(),
                                  style: const TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child:
                                      Text('order_button_retry_request'.tr()),
                                  onPressed: _refresh,
                                )
                              ],
                            );
                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            if (searchFormStore.valueBrand != '') {
                              return Column(
                                children: [
                                  DropdownButtonFormField(
                                    value: searchFormStore.valueBrand,
                                    decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueBrand,
                                      labelText: 'order_brand'.tr(),
                                      labelStyle: TextStyle(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 1.sp,
                                          fontSize: 16.sp),
                                      border: OutlineInputBorder(
                                        borderRadius:
                                            BorderRadius.circular(18.r),
                                      ),
                                      contentPadding: EdgeInsets.fromLTRB(
                                          10.sp, 5.sp, 10.sp, 5.sp),
                                    ),
                                    style: TextStyle(
                                        letterSpacing: 1.sp,
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
                                    icon: const Icon(
                                      Icons.keyboard_arrow_down_outlined,
                                    ),
                                    items: items.map((map) {
                                      return DropdownMenuItem<String>(
                                          value: map['value'],
                                          child: Text(map['title']));
                                    }).toList(),
                                  ),
                                  SizedBox(height: 10.h),
                                ],
                              );
                            }
                            return Column(
                              children: [
                                DropdownButtonFormField(
                                  decoration: InputDecoration(
                                    labelText: 'order_brand'.tr(),
                                    errorText: searchFormStore.error.valueBrand,
                                    labelStyle: TextStyle(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 1.sp,
                                        fontSize: 16.sp),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(18.r),
                                    ),
                                    contentPadding: EdgeInsets.fromLTRB(
                                        10.sp, 5.sp, 10.sp, 5.sp),
                                  ),
                                  style: TextStyle(
                                      letterSpacing: 1.sp,
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
                                  icon: const Icon(
                                    Icons.keyboard_arrow_down_outlined,
                                  ),
                                  items: items.map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                                SizedBox(height: 10.h),
                              ],
                            );
                        }
                      }),
                      Observer(builder: (_) {
                        final future = searchFormStore.initialModels;

                        if (future == null) {
                          return const SizedBox.shrink();
                        }

                        switch (future.status) {
                          case FutureStatus.pending:
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                const CircularProgressIndicator(),
                                Text('order_loading'.tr()),
                              ],
                            );

                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Text(
                                  'order_dropdown_error'.tr(),
                                  style: const TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child:
                                      Text(' order_button_retry_request'.tr()),
                                  onPressed: _refresh,
                                )
                              ],
                            );
                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            if (searchFormStore.valueModel != '') {
                              return Column(
                                children: [
                                  DropdownButtonFormField(
                                    value: searchFormStore.valueModel,
                                    decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueModel,
                                      labelText: 'order_model'.tr(),
                                      labelStyle: TextStyle(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 1.sp,
                                          fontSize: 16.sp),
                                      border: OutlineInputBorder(
                                        borderRadius:
                                            BorderRadius.circular(18.r),
                                      ),
                                      contentPadding: EdgeInsets.fromLTRB(
                                          10.sp, 5.sp, 10.sp, 5.sp),
                                    ),
                                    style: TextStyle(
                                        letterSpacing: 1.sp,
                                        fontWeight: FontWeight.w400,
                                        fontSize: 16.sp,
                                        fontFamily: 'Montserrat',
                                        color: Theme.of(context)
                                            .textTheme
                                            .bodyText1
                                            ?.color),
                                    onChanged: (value) {
                                      searchFormStore
                                          .modelSetValue(value.toString());
                                    },
                                    icon:const  Icon(
                                       Icons.keyboard_arrow_down_outlined,
                                    ),
                                    items: items.map((map) {
                                      return DropdownMenuItem<String>(
                                          value: map['value'],
                                          child: Text(map['title']));
                                    }).toList(),
                                  ),
                                  SizedBox(height: 10.h),
                                ],
                              );
                            }
                            return Column(
                              children: [
                                DropdownButtonFormField(
                                  decoration: InputDecoration(
                                    labelText: 'order_model'.tr(),
                                    errorText: searchFormStore.error.valueModel,
                                    labelStyle: TextStyle(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 1.sp,
                                        fontSize: 16.sp),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(18.r),
                                    ),
                                    contentPadding: EdgeInsets.fromLTRB(
                                        10.sp, 5.sp, 10.sp, 5.sp),
                                  ),
                                  style: TextStyle(
                                      letterSpacing: 1.sp,
                                      fontWeight: FontWeight.w400,
                                      fontSize: 16.sp,
                                      fontFamily: 'Montserrat',
                                      color: Theme.of(context)
                                          .textTheme
                                          .bodyText1
                                          ?.color),
                                  onChanged: (value) {
                                    searchFormStore
                                        .modelSetValue(value.toString());
                                  },
                                  icon: const Icon(
                                    Icons.keyboard_arrow_down_outlined,
                                  ),
                                  items: items.map((map) {
                                    return DropdownMenuItem<String>(
                                        value: map['value'],
                                        child: Text(map['title']));
                                  }).toList(),
                                ),
                                SizedBox(height: 10.h),
                              ],
                            );
                        }
                      }),
                      Observer(builder: (_) {
                        final future = searchFormStore.initialTransmission;
                        if (future == null) {
                          return const CircularProgressIndicator();
                        }
                        switch (future.status) {
                          case FutureStatus.pending:
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                const CircularProgressIndicator(),
                                Text('order_loading'.tr()),
                              ],
                            );
                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Text(
                                  'order_dropdown_error'.tr(),
                                  style:const  TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child:
                                      Text('order_button_retry_request'.tr()),
                                  onPressed: _refresh,
                                )
                              ],
                            );
                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            if (searchFormStore.valueTransmission != '') {
                              return Column(
                                children: [
                                  DropdownButtonFormField(
                                    value: searchFormStore.valueTransmission,
                                    decoration: InputDecoration(
                                      errorText: searchFormStore
                                          .error.valueTransmission,
                                      labelText: 'order_transmission'.tr(),
                                      labelStyle: TextStyle(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 1.sp,
                                          fontSize: 16.sp),
                                      border: OutlineInputBorder(
                                        borderRadius:
                                            BorderRadius.circular(18.r),
                                      ),
                                      contentPadding: EdgeInsets.fromLTRB(
                                          5.sp, 5.sp, 5.sp, 5.sp),
                                    ),
                                    style: TextStyle(
                                        letterSpacing: 1.sp,
                                        fontWeight: FontWeight.w400,
                                        fontSize: 16.sp,
                                        fontFamily: 'Montserrat',
                                        color: Theme.of(context)
                                            .textTheme
                                            .bodyText1
                                            ?.color),
                                    onChanged: (value) {
                                      searchFormStore.transmissionSetValue(
                                          value.toString());
                                    },
                                    icon: const Icon(
                                      Icons.keyboard_arrow_down_outlined,
                                    ),
                                    items: items.map((map) {
                                      return DropdownMenuItem<String>(
                                          value: map['value'],
                                          child: Text(map['title']).tr());
                                    }).toList(),
                                  ),
                                  SizedBox(height: 10.h),
                                ],
                              );
                            }
                            return Column(
                              children: [
                                DropdownButtonFormField(
                                  decoration: InputDecoration(
                                    labelText: 'order_transmission'.tr(),
                                    errorText:
                                        searchFormStore.error.valueTransmission,
                                    labelStyle: TextStyle(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 1.sp,
                                        fontSize: 16.sp),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(18.r),
                                    ),
                                    contentPadding: EdgeInsets.fromLTRB(
                                        5.sp, 5.sp, 5.sp, 5.sp),
                                  ),
                                  style: TextStyle(
                                      letterSpacing: 1.sp,
                                      fontWeight: FontWeight.w400,
                                      fontSize: 16.sp,
                                      fontFamily: 'Montserrat',
                                      color: Theme.of(context)
                                          .textTheme
                                          .bodyText1
                                          ?.color),
                                  onChanged: (value) {
                                    searchFormStore
                                        .transmissionSetValue(value.toString());
                                  },
                                  icon: const Icon(
                                    Icons.keyboard_arrow_down_outlined,
                                  ),
                                  items: items.map((val) {
                                    return DropdownMenuItem<String>(
                                        value: val['value'],
                                        child: Text(val['title']).tr());
                                  }).toList(),
                                ),
                                SizedBox(height: 10.h),
                              ],
                            );
                        }
                      }),
                      Observer(builder: (_) {
                        final future = searchFormStore.initialBodyType;
                        if (future == null) {
                          return const CircularProgressIndicator();
                        }
                        switch (future.status) {
                          case FutureStatus.pending:
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                const CircularProgressIndicator(),
                                Text('order_loading'.tr()),
                              ],
                            );
                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Text(
                                  'order_dropdown_error'.tr(),
                                  style:const  TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child:
                                      Text('order_button_retry_request'.tr()),
                                  onPressed: _refresh,
                                )
                              ],
                            );
                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            if (searchFormStore.valueBodyType != '') {
                              return Column(
                                children: [
                                  DropdownButtonFormField(
                                    value: searchFormStore.valueBodyType,
                                    decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueBodyType,
                                      labelText: 'order_body_type'.tr(),
                                      labelStyle: TextStyle(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 1.sp,
                                          fontSize: 16.sp),
                                      border: OutlineInputBorder(
                                        borderRadius:
                                            BorderRadius.circular(18.r),
                                      ),
                                      contentPadding: EdgeInsets.fromLTRB(
                                          5.sp, 5.sp, 5.sp, 5.sp),
                                    ),
                                    style: TextStyle(
                                        letterSpacing: 1.sp,
                                        fontWeight: FontWeight.w400,
                                        fontSize: 16.sp,
                                        fontFamily: 'Montserrat',
                                        color: Theme.of(context)
                                            .textTheme
                                            .bodyText1
                                            ?.color),
                                    onChanged: (value) {
                                      searchFormStore
                                          .bodyTypeSetValue(value.toString());
                                    },
                                    icon:const  Icon(
                                      Icons.keyboard_arrow_down_outlined,
                                    ),
                                    items: items.map((map) {
                                      return DropdownMenuItem<String>(
                                          value: map['value'],
                                          child: Text(map['title']).tr());
                                    }).toList(),
                                  ),
                                  SizedBox(height: 10.h),
                                ],
                              );
                            }
                            return Column(
                              children: [
                                DropdownButtonFormField(
                                  decoration: InputDecoration(
                                    labelText: 'order_body_type'.tr(),
                                    errorText:
                                        searchFormStore.error.valueBodyType,
                                    labelStyle: TextStyle(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 1.sp,
                                        fontSize: 16.sp),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(18.r),
                                    ),
                                    contentPadding: EdgeInsets.fromLTRB(
                                        5.sp, 5.sp, 5.sp, 5.sp),
                                  ),
                                  style: TextStyle(
                                      letterSpacing: 1.sp,
                                      fontWeight: FontWeight.w400,
                                      fontSize: 16.sp,
                                      fontFamily: 'Montserrat',
                                      color: Theme.of(context)
                                          .textTheme
                                          .bodyText1
                                          ?.color),
                                  onChanged: (value) {
                                    searchFormStore
                                        .bodyTypeSetValue(value.toString());
                                  },
                                  icon:const  Icon(
                                    Icons.keyboard_arrow_down_outlined,
                                  ),
                                  items: items.map((val) {
                                    return DropdownMenuItem<String>(
                                        value: val['value'],
                                        child: Text(val['title']).tr());
                                  }).toList(),
                                ),
                                SizedBox(height: 10.h),
                              ],
                            );
                        }
                      }),
                      Observer(builder: (_) {
                        final future = searchFormStore.initialDrive;
                        if (future == null) {
                          return const CircularProgressIndicator();
                        }
                        switch (future.status) {
                          case FutureStatus.pending:
                            return Column(
                              mainAxisAlignment: MainAxisAlignment.end,
                              children: [
                                const CircularProgressIndicator(),
                                Text('order_loading'.tr()),
                              ],
                            );
                          case FutureStatus.rejected:
                            return Row(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: <Widget>[
                                Text(
                                  'order_dropdown_error'.tr(),
                                  style:const  TextStyle(color: Colors.red),
                                ),
                                ElevatedButton(
                                  child:
                                      Text('order_button_retry_request'.tr()),
                                  onPressed: _refresh,
                                )
                              ],
                            );
                          case FutureStatus.fulfilled:
                            final List<dynamic> items = future.result;
                            if (searchFormStore.valueDrive != '') {
                              return Column(
                                children: [
                                  DropdownButtonFormField(
                                    value: searchFormStore.valueDrive,
                                    decoration: InputDecoration(
                                      errorText:
                                          searchFormStore.error.valueDrive,
                                      labelText: 'order_drive'.tr(),
                                      labelStyle: TextStyle(
                                          fontFamily: 'Montserrat',
                                          letterSpacing: 1.sp,
                                          fontSize: 16.sp),
                                      border: OutlineInputBorder(
                                        borderRadius:
                                            BorderRadius.circular(18.r),
                                      ),
                                      contentPadding: EdgeInsets.fromLTRB(
                                          5.sp, 5.sp, 5.sp, 5.sp),
                                    ),
                                    style: TextStyle(
                                        letterSpacing: 1.sp,
                                        fontWeight: FontWeight.w400,
                                        fontSize: 16.sp,
                                        fontFamily: 'Montserrat',
                                        color: Theme.of(context)
                                            .textTheme
                                            .bodyText1
                                            ?.color),
                                    onChanged: (value) {
                                      searchFormStore
                                          .driveSetValue(value.toString());
                                    },
                                    icon:const  Icon(
                                      Icons.keyboard_arrow_down_outlined,
                                    ),
                                    items: items.map((map) {
                                      return DropdownMenuItem<String>(
                                          value: map['value'],
                                          child: Text(map['title']).tr());
                                    }).toList(),
                                  ),
                                  SizedBox(height: 10.h),
                                ],
                              );
                            }
                            return Column(
                              children: [
                                DropdownButtonFormField(
                                  decoration: InputDecoration(
                                    labelText: 'order_drive'.tr(),
                                    errorText: searchFormStore.error.valueDrive,
                                    labelStyle: TextStyle(
                                        fontFamily: 'Montserrat',
                                        letterSpacing: 1.sp,
                                        fontSize: 16.sp),
                                    border: OutlineInputBorder(
                                      borderRadius: BorderRadius.circular(18.r),
                                    ),
                                    contentPadding: EdgeInsets.fromLTRB(
                                        5.sp, 5.sp, 5.sp, 5.sp),
                                  ),
                                  style: TextStyle(
                                      letterSpacing: 1.sp,
                                      fontWeight: FontWeight.w400,
                                      fontSize: 16.sp,
                                      fontFamily: 'Montserrat',
                                      color: Theme.of(context)
                                          .textTheme
                                          .bodyText1
                                          ?.color),
                                  onChanged: (value) {
                                    searchFormStore
                                        .driveSetValue(value.toString());
                                  },
                                  icon:const  Icon(
                                    Icons.keyboard_arrow_down_outlined,
                                  ),
                                  items: items.map((val) {
                                    return DropdownMenuItem<String>(
                                        value: val['value'],
                                        child: Text(val['title']).tr());
                                  }).toList(),
                                ),
                                SizedBox(height: 10.h),
                              ],
                            );
                        }
                      }),
                      Row(children: [
                        Observer(
                          builder: (_) => Expanded(
                            child: TextFormField(
                                keyboardType: TextInputType.number,
                                autofocus: false,
                                controller: searchFormStore.yearController,
                                style: TextStyle(
                                  fontSize: 16.sp,
                                ),
                                maxLength: 4,
                                decoration: InputDecoration(
                                  counterText: "",
                                  errorText: searchFormStore.error.year,
                                  labelText: 'order_year'.tr(),
                                  labelStyle:const  TextStyle(
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 1),
                                  contentPadding: EdgeInsets.fromLTRB(
                                      10.sp, 15.sp, 10.sp, 15.sp),
                                  border: OutlineInputBorder(
                                    borderRadius: BorderRadius.circular(18.r),
                                  ),
                                )),
                          ),
                        ),
                        SizedBox(width: 10.w),
                        Observer(
                          builder: (_) => Expanded(
                            child: TextFormField(
                              keyboardType: TextInputType.number,
                              autofocus: false,
                              controller:
                                  searchFormStore.engineVolumeController,
                              style: TextStyle(
                                fontSize: 16.sp,
                              ),
                              onChanged: (value) {},
                              inputFormatters: [maskFormatter],
                              maxLength: 3,
                              decoration: InputDecoration(
                                counterText: '',
                                errorText: searchFormStore.error.volume,
                                labelText: 'order_engine_volume'.tr(),
                                labelStyle:const  TextStyle(
                                    fontFamily: 'Montserrat', letterSpacing: 1),
                                contentPadding: EdgeInsets.fromLTRB(
                                    10.sp, 15.sp, 10.sp, 15.sp),
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(18.r),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ]),
                      SizedBox(height: 10.h),
                      Observer(
                        builder: (_) => TextFormField(
                            autofocus: false,
                            controller: searchFormStore.vinNumberController,
                            style: TextStyle(
                              fontSize: 16.sp,
                            ),
                            onChanged: (value) {},
                            decoration: InputDecoration(
                              errorText: searchFormStore.error.vinNumber,
                              labelText: 'order_vin_number'.tr(),
                              labelStyle:const  TextStyle(
                                  fontFamily: 'Montserrat', letterSpacing: 1),
                              contentPadding: EdgeInsets.fromLTRB(
                                  10.sp, 15.sp, 10.sp, 15.sp),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(18.r),
                              ),
                            )),
                      ),
                      Observer(builder: (_) {
                        if (searchFormStore.loaderStatus == true) {
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              SizedBox(height: 2.h),
                              const CircularProgressIndicator(),
                              Text('order_loading'.tr()),
                            ],
                          );
                        }
                        return GridView.count(
                          padding: EdgeInsets.zero,
                          shrinkWrap: true,
                          childAspectRatio: 4,
                          physics: const NeverScrollableScrollPhysics(),
                          crossAxisCount: 2,
                          children: searchFormStore.fuelType.keys.map(
                            (key) {
                              return Container(
                                  child: SwitchListTile(
                                contentPadding: EdgeInsets.zero,
                                activeColor: Theme.of(context).primaryColor,
                                inactiveTrackColor:
                                    searchFormStore.error.fuel != null
                                        ? Colors.red[300]
                                        : Colors.grey[200],
                                title: Text(
                                  key,
                                  style: TextStyle(
                                      fontSize: 16.sp,
                                      fontWeight: FontWeight.w400,
                                      fontFamily: 'Montserrat',
                                      letterSpacing: 1.sp),
                                ).tr(),
                                value: searchFormStore.fuelType[key],
                                onChanged: (value) {
                                  searchFormStore.changeFuelType(key, value);
                                },
                              ));
                            },
                          ).toList(),
                        );
                      }),
                      const SizedBox(height: 10),
                      Observer(
                        builder: (_) => TextFormField(
                          autofocus: false,
                          maxLines: null,
                          controller: searchFormStore.carPartsController,
                          style: TextStyle(
                            fontSize: 16.sp,
                          ),
                          onChanged: (value) {},
                          decoration: InputDecoration(
                            errorText: searchFormStore.error.carParts,
                            labelText: 'order_parts'.tr(),
                            labelStyle:const  TextStyle(
                                fontFamily: 'Montserrat', letterSpacing: 1),
                            contentPadding:
                                EdgeInsets.fromLTRB(10.sp, 15.sp, 10.sp, 15.sp),
                            border: OutlineInputBorder(
                              borderRadius: BorderRadius.circular(18.r),
                            ),
                          ),
                        ),
                      ),
                      Observer(builder: (_) {
                        if (searchFormStore.loaderStatus == true) {
                          return Column(
                            mainAxisAlignment: MainAxisAlignment.end,
                            children: [
                              SizedBox(height: 2.h),
                              const CircularProgressIndicator(),
                              Text('order_loading'.tr()),
                            ],
                          );
                        }

                        return GridView.count(
                          padding: EdgeInsets.zero,
                          shrinkWrap: true,
                          physics:const  NeverScrollableScrollPhysics(),
                          childAspectRatio: 4,
                          crossAxisCount: 2,
                          children: searchFormStore.partType.keys.map((key) {
                            return SwitchListTile(
                              contentPadding: EdgeInsets.zero,
                              activeColor: Theme.of(context).primaryColor,
                              inactiveTrackColor:
                              searchFormStore.error.partType != null
                                  ? Colors.red[300]
                                  : Colors.grey[200],
                              title: Text(
                            key,
                            style: TextStyle(
                              fontSize: 16.sp,
                              fontWeight: FontWeight.w400,
                              fontFamily: 'Montserrat',
                            ),
                              ).tr(),
                              value: searchFormStore.partType[key],
                              onChanged: (value) {
                            searchFormStore.changePartType(key, value);
                              },
                            );
                          }).toList(),
                        );
                      }),
                      SizedBox(height: 15.h),
                      Observer(
                        builder: (_) {
                          return SizedBox(
                              height: 40.h,
                              width: 0.8.sw,
                              child: Material(
                                borderRadius: BorderRadius.circular(18.0),
                                color: Colors.green,
                                elevation: 7.0,
                                child: TextButton(
                                  onPressed: () {
                                    searchFormStore.validateAll();
                                    if (searchFormStore.error.hasErrors == false) {
                                      searchFormStore.sendOrder();
                                      alertSuccess();
                                    } else {
                                      print(searchFormStore.toJson());
                                    }
                                  },
                                  child: Center(
                                    child: Text(
                                      searchFormStore.statusOrder == false ? 'send_order_btn'.tr() : 'repeat_order_btn'.tr() ,
                                      style: TextStyle(
                                          color: Colors.white,
                                          fontSize: 14.sp,
                                          letterSpacing: 1.sp,
                                          fontWeight: FontWeight.w400,
                                          fontFamily: 'Montserrat'),
                                    ),
                                  ),
                                ),
                              ));
                        }
                      ),
                    ],
                  ),
                ),
              ),
            )
          : Scaffold(
              body: Center(
                child: Container(
                  padding: EdgeInsets.only(right: 10.sp, left: 10.sp),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.center,
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.wifi_off_outlined, size: 60.sp),
                      SizedBox(height: 10.h),
                      Text('connection_status_failed'.tr(),
                          style: TextStyle(
                              fontSize: 16.sp,
                              letterSpacing: 1.sp,
                              fontWeight: FontWeight.w400,
                              fontFamily: 'Montserrat')),
                    ],
                  ),
                ),
              ),
            ),
    );
  }
}
