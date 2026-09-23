import 'dart:async';
import 'dart:io';
import 'package:flutter_test/flutter_test.dart';

// Serve the same bundled illustration to native widget tests without networking.
class FixtureImageClient extends Fake implements HttpClient {
  @override
  Future<HttpClientRequest> getUrl(Uri url) async => _Request(url);
}

class _Request extends Fake implements HttpClientRequest {
  _Request(this.url);
  final Uri url;
  @override
  Future<HttpClientResponse> close() async => _Response(url);
}

class _Response extends Stream<List<int>> implements HttpClientResponse {
  _Response(Uri url)
    : bytes = File(
        url.path.endsWith('avatar_synthetic.png')
            ? 'assets/images/avatar_synthetic.png'
            : 'assets/images/login_background_for_light2.png',
      ).readAsBytesSync();
  final List<int> bytes;
  @override
  int get statusCode => 200;
  @override
  int get contentLength => bytes.length;
  @override
  HttpClientResponseCompressionState get compressionState =>
      HttpClientResponseCompressionState.notCompressed;
  @override
  StreamSubscription<List<int>> listen(
    void Function(List<int>)? onData, {
    Function? onError,
    void Function()? onDone,
    bool? cancelOnError,
  }) => Stream.value(bytes).listen(
    onData,
    onError: onError,
    onDone: onDone,
    cancelOnError: cancelOnError,
  );
  @override
  dynamic noSuchMethod(Invocation invocation) => super.noSuchMethod(invocation);
}
