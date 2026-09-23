import 'dart:convert';
import 'dart:js_interop';
import 'package:web/web.dart' as web;

void notifyScreen(String screen) {
  web.window.parent?.postMessage(
    jsonEncode({'type': 'bloomy-screen', 'screen': screen}).toJS,
    web.window.location.origin.toJS,
  );
}
