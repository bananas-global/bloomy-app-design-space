import 'dart:convert';
import 'dart:js_interop';
import 'package:web/web.dart' as web;

void notifyScreen(String screen) {
  web.window.parent?.postMessage(
    jsonEncode({'type': 'bloomy-screen', 'screen': screen}).toJS,
    web.window.location.origin.toJS,
  );
}

void Function() listenFixtures(void Function(String) onFixture) {
  final listener = ((web.MessageEvent event) {
    if (event.origin != web.window.location.origin ||
        event.source != web.window.parent ||
        event.data == null)
      return;
    try {
      final data = jsonDecode((event.data as JSString).toDart);
      if (data is Map &&
          data['type'] == 'bloomy-fixture' &&
          data['data'] is Map) {
        onFixture(jsonEncode(data['data']));
      }
    } catch (_) {}
  }).toJS;
  web.window.addEventListener('message', listener);
  web.window.parent?.postMessage(
    jsonEncode({'type': 'bloomy-ready'}).toJS,
    web.window.location.origin.toJS,
  );
  return () => web.window.removeEventListener('message', listener);
}
