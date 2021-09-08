import 'package:avto_opt/api_client/api_client.dart';
import 'package:avto_opt/api_client/endpoints/brands_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/models_endpoint.dart';
import 'package:avto_opt/api_client/endpoints/transport_endpoint.dart';
import 'package:mobx/mobx.dart';
import 'package:validators/validators.dart';
part 'search_form_store.g.dart';

String getInitValueFromResponse(List listName, String type) {
  var result = [];
  listName.forEach((element) => result.add((element['title'])));
  return result.firstWhere((element) => element == type);
}

Map<String, String> transportTranslate = {
  'auto': 'Автомобиль',
  'moto': 'Мотоцикл',
  'bus': 'Автобус',
  'truck': 'Грузовой Автомобиль'
};

class SearchFormStore = _SearchFormStore with _$SearchFormStore;

abstract class _SearchFormStore with Store {
  final SearchFormErrorState error = SearchFormErrorState();
  late List<ReactionDisposer> _disposers;
  
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
  List<dynamic> initialDrive = [
    {'value': 'Полный', 'title': 'Полный'},
    {'value': 'Передний', 'title': 'Передний'},
    {'value': 'Задний', 'title': 'Задний'}
  ];
  @observable
  List<dynamic> initialBodyType = [
    {'value': 'Седан', 'title': 'Седан'},
    {'value': 'Хэтчбэк', 'title': 'Хэтчбэк'},
    {'value': 'Купе', 'title': 'Купе'},
    {'value': 'Универсал', 'title': 'Универсал'},
    {'value': 'Минивэн', 'title': 'Минивэн'},
    {'value': 'Внедорожник', 'title': 'Внедорожник'},
    {'value': 'Пикап', 'title': 'Пикап'},
    {'value': 'Кабриолет', 'title': 'Кабриолет'},
    {'value': 'Фургон', 'title': 'Фургон'},
    {'value': 'Лимузин', 'title': 'Лимузин'}
  ];
  @observable
  List<dynamic> initialTransmission = [
    {'value': 'Механика', 'title': 'Механика'},
    {'value': 'Автомат', 'title': 'Автомат'}
  ];
  @observable
  ObservableFuture<List<dynamic>>?
      initialTransportType; // todo change dynamic to nedded type
  @observable
  ObservableMap<dynamic, dynamic> fuelType = ObservableMap.of({
    'Бензин': false,
    'Дизель': false,
    'Електро': false,
    'Гибрид': false,
  });

  @action
  void changeFuelType(key, value) {
    fuelType[key] = value;
    validateFuelType(fuelType);
  }

  @observable
  ObservableMap partType = ObservableMap.of({
    'Оригинал': false,
    'Аналог': false,
  });

  @action
  void changePartType(String key, bool value) {
    partType[key] = value;
    validatePartType(partType);
  }

  @action
  void brandSetValue(String value) {
    valueBrand = value;
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
    valueTransportType = value;
    getBrands(value.toString());
  }

  Future<List<dynamic>> getTransportByHttp() async {
    Client _client = new Client();
    var _endpointProvider = new EndpointTransportProvider(_client.init());
    List<dynamic> data = await _endpointProvider.getTransport();
    return data;
  }

  @action
  Future getTransport() => initialTransportType = ObservableFuture(getTransportByHttp());
  
  @action
  Future getModel(String brand) => initialModels = ObservableFuture(getModelByHttp(brand));

  @action
  Future<List<dynamic>> getModelByHttp(String brand) async {
    Client _client = new Client();
    var _endpointProvider = new EndpointModelsProvider(_client.init());
    List<dynamic> data = await _endpointProvider.getModels(valueTransportType, brand);
    data = data.map((element) => {'value': element['id'], 'title': element['name']}).toList();
    return data;
  }

  @action
  Future getBrands(String type) =>
      initialBrands = ObservableFuture(getBrandsByHttp(type));

  Future<List<dynamic>> getBrandsByHttp(String type) async {
    Client _client = new Client();
    var _endpointProvider = new EndpointBrandsProvider(_client.init());
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
    value == 'Тип транспорта:'
        ? error.valueTransportType = 'Поле обязательно'
        : error.valueTransportType = null;
  }

  @action
  void validateBrand(String value) {
    value == 'Марка:'
        ? error.valueBrand = 'Поле обязательно'
        : error.valueBrand = null;
  }

  @action
  void validateModel(String value) {
    value == 'Модель:'
        ? error.valueModel = 'Поле обязательно'
        : error.valueModel = null;
  }

  @action
  void validateTransmission(String value) {
    value == 'Коробка передач:'
        ? error.valueTransmission = 'Поле обязательно'
        : error.valueTransmission = null;
  }

  @action
  void validateBodyType(String value) {
    value == 'Тип кузова:'
        ? error.valueBodyType = 'Поле обязательно'
        : error.valueBodyType = null;
  }

  @action
  void validateDrive(String value) {
    value == 'Привод:'
        ? error.valueDrive = 'Поле обязательно'
        : error.valueDrive = null;
  }

  @action
  void validateYear(String value) {
    error.year = isNull(value) || value.isEmpty ? 'Поле обязательно' : null;
  }

  @action
  void validateVolume(String value) {
    error.volume = isNull(value) || value.isEmpty ? 'Поле обязательно' : null;
  }

  @action
  void validateVinNumber(String value) {
    error.vinNumber =
        isNull(value) || value.isEmpty ? 'Поле обязательно' : null;
  }

  @action
  void validateCarParts(String value) {
    error.carParts = isNull(value) || value.isEmpty ? 'Поле обязательно' : null;
  }

  @action
  void validateFuelType(ObservableMap<dynamic, dynamic> value) {
    error.fuel = value.values.contains(true) ? null : 'Выбор обязательный';
  }

  @action
  void validatePartType(ObservableMap<dynamic, dynamic> value) {
    error.partType = value.values.contains(true) ? null : 'Выбор обязательный';
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
