import 'dart:convert';
import 'package:avto_opt/api_client/api_client.dart';
import 'package:avto_opt/api_client/endpoints/body_type_endpoint%20.dart';
import 'package:avto_opt/api_client/endpoints/brands_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/car_part_type_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/drive_type_endpoint%20.dart';
import 'package:avto_opt/api_client/endpoints/fuel_type_endpoint%20.dart';
import 'package:avto_opt/api_client/endpoints/models_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/order_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/transmission_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/transport_endpoint.dart';
import 'package:flutter/cupertino.dart';
import 'package:mobx/mobx.dart';
import 'package:validators/validators.dart';
import 'package:easy_localization/easy_localization.dart';
part 'search_form_store.g.dart';

class SearchFormStore = _SearchFormStore with _$SearchFormStore;

abstract class _SearchFormStore with Store {
  final Client _client = Client();
  final SearchFormErrorState error = SearchFormErrorState();
  late List<ReactionDisposer> _disposers;
  @observable
  TextEditingController yearController = TextEditingController();
  @observable
  TextEditingController engineVolumeController = TextEditingController();
  @observable
  TextEditingController vinNumberController = TextEditingController();
  @observable
  TextEditingController carPartsController = TextEditingController();

  @observable
  bool statusOrder = false;

  @observable
  bool loaderStatus = false;

  @observable
  String year = '';

  @observable
  String volume = '';

  @observable
  String vinNumber = '';

  @observable
  String carParts = '';

  @observable
  String valueDrive = '';

  @observable
  String valueModel = '';

  @observable
  String valueBrand = '';

  @observable
  String valueTransportType = '';

  @observable
  String valueTransmission = '';

  @observable
  String valueBodyType = '';

  @observable
  ObservableFuture<List<dynamic>>? initialModels;

  @observable
  ObservableFuture<List<dynamic>>? initialBrands;

  @observable
  ObservableFuture<List<dynamic>>? initialDrive;

  @observable
  ObservableFuture<List<dynamic>>? initialBodyType;

  @observable
  ObservableFuture<List<dynamic>>? initialTransmission;

  @observable
  ObservableFuture<List<dynamic>>? initialTransportType;

  @observable
  ObservableMap fuelType = ObservableMap.of({});

  @observable
  ObservableMap partType = ObservableMap.of({});

  String toJson() {
    List upperCaseFuel =
        fuelType.keys.where((elem) => fuelType[elem] == true).toList();
    upperCaseFuel =
        upperCaseFuel.map((e) => e.toString().toUpperCase()).toList();
    List upperCasePartType =
        partType.keys.where((elem) => partType[elem] == true).toList();
    upperCasePartType =
        upperCasePartType.map((e) => e.toString().toUpperCase()).toList();

    return jsonEncode({
      'modelId': valueModel,
      'transmission': valueTransmission,
      'bodyType': valueBodyType,
      'drive': valueDrive,
      'year': year,
      'engineVolume': volume,
      'vin': vinNumber,
      'carPart': carParts.trim(),
      'fuel': upperCaseFuel,
      'part': upperCasePartType
    });
  }

  @action
  Future sendOrder() async {
    var result = toJson();
    var _endpointProvider = EndpointOrderProvider(_client.init());
    var status = await _endpointProvider.sendOrder(result);
    statusOrder = status != 201 ? false : true;
    print(status);
  }

  @action
  void changeFuelType(key, value) {
    fuelType[key] = value;
    validateFuelType(fuelType);
  }

  @action
  void changePartType(String key, bool value) {
    partType[key] = value;
    validatePartType(partType);
  }

  @action
  void brandSetValue(String value) {
    if (value == valueBrand) return;
    valueBrand = value;
    valueModel = '';
    getModel(value.toString());
  }

  @action
  void modelSetValue(String value) {
    valueModel = value;
  }

  @action
  void transmissionSetValue(String value) {
    valueTransmission = value;
  }

  @action
  void bodyTypeSetValue(String value) {
    valueBodyType = value;
  }

  @action
  void driveSetValue(String value) {
    valueDrive = value;
  }

  @action
  void transportTypeSetValue(String value) {
    if (value == valueTransportType) return;
    valueTransportType = value;
    valueBrand = '';
    valueModel = '';
    getBrands(value.toString());
  }

  Future<List<dynamic>> getTransportByHttp() async {
    var _endpointProvider = EndpointTransportProvider(_client.init());
    List<dynamic> data = await _endpointProvider.getTransport();
    return data;
  }

  @action
  Future getTransport() =>
      initialTransportType = ObservableFuture(getTransportByHttp());

  @action
  Future getOrder() async {
    var _endpointProvider = EndpointOrderProvider(_client.init());
    var data = await _endpointProvider.getLastOrder();
    if (data == '') {
      setDefaultValue();
    } else {
      setValueFromHttp(data);
    }
  }

  @action
  void setDefaultValue() {
    getTransport();
    getTransmission();
    getBodyType();
    getCarPartTypeByHttp();
    getFuelTypeByHttp();
    getDriveType();
  }

  @action
  Future setValueFromHttp(data) async {
    List fuels = data['fuel'];
    List partTypes = data['part'];
    await getCarPartTypeByHttp();
    await getFuelTypeByHttp();
    valueTransportType = data['model']['typeId'];
    valueBrand = data['model']['brandId'];
    valueModel = data['model']['id'];
    valueDrive = 'FRONT';
    valueTransmission = data['transmission'];
    valueBodyType = data['bodyType'];
    year = data['year'];
    yearController.text = year;
    volume = data['engineVolume'];
    engineVolumeController.text = volume;
    vinNumber = data['vin'];
    vinNumberController.text = vinNumber;
    carParts = data['carPart'];
    carPartsController.text = carParts;
    for (var item in fuels) {
      fuelType.update(item.toString().toLowerCase(), (value) => true);
    }
    for (var item in partTypes) {
      partType.update(item.toString().toLowerCase(), (value) => true);
    }
    getBrands(valueTransportType);
    getModel(valueBrand);
    getTransport();
    getTransmission();
    getBodyType();
    getDriveType();
  }

  @action
  Future getModel(String brand) =>
      initialModels = ObservableFuture(getModelByHttp(brand));

  Future<List<dynamic>> getModelByHttp(String brand) async {
    var _endpointProvider = EndpointModelsProvider(_client.init());
    List<dynamic> data =
        await _endpointProvider.getModels(valueTransportType, brand);
    data = data
        .map((element) => {'value': element['id'], 'title': element['name']})
        .toList();
    return data;
  }

  @action
  Future getTransmission() =>
      initialTransmission = ObservableFuture(getTransmissionByHttp());

  Future<List<dynamic>> getTransmissionByHttp() async {
    var _endpointProvider = EndpointTransmissionProvider(_client.init());
    List<dynamic> data = await _endpointProvider.getTransmisson();
    data = data
        .map((element) => {
              'value': element.toString(),
              'title': element.toString().toLowerCase()
            })
        .toList();
    return data;
  }

  @action
  Future getBodyType() =>
      initialBodyType = ObservableFuture(getBodyTypeByHttp());

  Future<List<dynamic>> getBodyTypeByHttp() async {
    var _endpointProvider = EndpointBodyTypeProvider(_client.init());
    List<dynamic> data = await _endpointProvider.getTransmisson();
    data = data
        .map((element) => {
              'value': element.toString(),
              'title': element.toString().toLowerCase()
            })
        .toList();
    return data;
  }

  @action
  Future getDriveType() =>
      initialDrive = ObservableFuture(getDriveTypeByHttp());

  Future<List<dynamic>> getDriveTypeByHttp() async {
    var _endpointProvider = EndpointDriveTypeProvider(_client.init());
    List<dynamic> data = await _endpointProvider.getDriveType();
    data = data
        .map((element) => {
              'value': element.toString(),
              'title': element.toString().toLowerCase()
            })
        .toList();
    return data;
  }

  @action
  Future getFuelTypeByHttp() async {
    loaderStatus = true;
    var _endpointProvider = EndpointFuelTypeProvider(_client.init());
    var data = await _endpointProvider.getFuelType();
    data = { for (var v in data) v.toString().toLowerCase() : false };
    fuelType.addAll(data);
    loaderStatus = false;
  }

  @action
  Future getCarPartTypeByHttp() async {
    loaderStatus = true;
    var _endpointProvider = EndpointCarPartTypeProvider(_client.init());
    var data = await _endpointProvider.getCarPartType();
    data = { for (var v in data) v.toString().toLowerCase() : false };
    partType.addAll(data);
    loaderStatus = false;
  }

  @action
  Future getBrands(String type) =>
      initialBrands = ObservableFuture(getBrandsByHttp(type));

  Future<List<dynamic>> getBrandsByHttp(String type) async {
    var _endpointProvider = EndpointBrandsProvider(_client.init());
    List<dynamic> data = await _endpointProvider.getBrands(type);
    data = data
        .map((element) => {'value': element['id'], 'title': element['name']})
        .toList();
    return data;
  }

  void dispose() {
    for (final d in _disposers) {
      d();
    }
  }

  void setupValidations() {
    _disposers = [
      reaction((_) => valueTransportType, validateTransportType),
      reaction((_) => valueBrand, validateBrand),
      reaction((_) => valueModel, validateModel),
      reaction((_) => valueTransmission, validateTransmission),
      reaction((_) => valueBodyType, validateBodyType),
      reaction((_) => valueDrive, validateDrive),
      reaction((_) => year, validateYear),
      reaction((_) => volume, validateVolume),
      reaction((_) => vinNumber, validateVinNumber),
      reaction((_) => carParts, validateCarParts),
      reaction((_) => fuelType, validateFuelType),
      reaction((_) => partType, validatePartType)
    ];
  }

  @action
  void validateTransportType(String value) {
    value == ''
        ? error.valueTransportType = 'order_required_field'.tr()
        : error.valueTransportType = null;
  }

  @action
  void validateBrand(String value) {
    if (valueTransportType == '') return error.valueBrand = null;
    value == ''
        ? error.valueBrand = 'order_required_field'.tr()
        : error.valueBrand = null;
  }

  @action
  void validateModel(String value) {
    if (valueTransportType == '' && valueBrand == '') {
      return error.valueModel = null;
    }
    value == ''
        ? error.valueModel = 'order_required_field'.tr()
        : error.valueModel = null;
  }

  @action
  void validateTransmission(String value) {
    value == ''
        ? error.valueTransmission = 'order_required_field'.tr()
        : error.valueTransmission = null;
  }

  @action
  void validateBodyType(String value) {
    value == ''
        ? error.valueBodyType = 'order_required_field'.tr()
        : error.valueBodyType = null;
  }

  @action
  void validateDrive(String value) {
    error.valueDrive = value == '' ? 'order_required_field'.tr() : null;
  }

  @action
  void validateYear(String value) {
    error.year = isNull(value) || value.isEmpty || value.length < 4
        ? 'Минимум 4 симовола'
        : null;
  }

  @action
  void validateVolume(String value) {
    error.volume =
        isNull(value) || value.isEmpty ? 'order_required_field'.tr() : null;
  }

  @action
  void validateVinNumber(String value) {
    error.vinNumber =
        isNull(value) || value.isEmpty ? 'order_required_field'.tr() : null;
  }

  @action
  void validateCarParts(String value) {
    error.carParts =
        isNull(value) || value.isEmpty ? 'order_required_field'.tr() : null;
  }

  @action
  void validateFuelType(ObservableMap<dynamic, dynamic> value) {
    error.fuel =
        value.values.contains(true) ? null : 'order_required_field'.tr();
  }

  @action
  void validatePartType(ObservableMap<dynamic, dynamic> value) {
    error.partType =
        value.values.contains(true) ? null : 'order_required_field'.tr();
  }

  @action
  void validateAll() {
    validateTransportType(valueTransportType);
    validateBrand(valueBrand);
    validateModel(valueModel);
    validateTransmission(valueTransmission);
    validateBodyType(valueBodyType);
    validateDrive(valueDrive);
    validateYear(year);
    validateVolume(volume);
    validateVinNumber(vinNumber);
    validateCarParts(carParts);
    validateFuelType(fuelType);
    validatePartType(partType);
  }
}

class SearchFormErrorState = _SearchFormErrorState with _$SearchFormErrorState;

abstract class _SearchFormErrorState with Store {
  @observable
  String? valueDrive;

  @observable
  String? valueModel;

  @observable
  String? valueBrand;

  @observable
  String? valueTransportType;

  @observable
  String? valueTransmission;

  @observable
  String? valueBodyType;

  @observable
  String? year;

  @observable
  String? volume;

  @observable
  String? vinNumber;

  @observable
  String? carParts;

  @observable
  String? fuel;

  @observable
  String? partType;

  @computed
  bool get hasErrors =>
      valueDrive != null ||
      valueBrand != null ||
      valueTransportType != null ||
      valueTransmission != null ||
      valueBodyType != null ||
      year != null ||
      volume != null ||
      vinNumber != null ||
      carParts != null ||
      fuel != null ||
      partType != null;
}
