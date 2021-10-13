import 'package:avto_opt/api_client/endpoints/localization_endpoint.dart';
import 'package:easy_localization/easy_localization.dart';
import 'package:easy_localization_loader/easy_localization_loader.dart';
import 'dart:ui';

class HttpAssetLoader extends AssetLoader {
  final _client = EndpointLocalizationProvider();
  @override
  Future<Map<String, dynamic>> load(String path, Locale locale) async {
    Map<String, dynamic> localTranslation =
        await JsonAssetLoader().load('assets/translations', locale);
    var url = '$path/$locale.json';
    var response = await _client.getLocalization(url);
    if (response != null) {
      localTranslation.addAll(response.data);
    } else {
      return localTranslation;
    }
    return localTranslation;
  }
}
