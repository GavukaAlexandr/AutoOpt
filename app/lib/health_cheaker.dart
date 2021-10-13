import 'package:avto_opt/api_client/endpoints/health_check_endpoint.dart';

Future healthCheck() async {
  var _endpointProvider = EndpointHealthCheckProvider();
  var result = await _endpointProvider.healthCheckHttp();
  return result ?? false;
}