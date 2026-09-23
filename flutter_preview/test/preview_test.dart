import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:bloomy_design_preview/main.dart';

Future<void> open(WidgetTester tester, String page) async {
  tester.view.physicalSize = const Size(402, 874);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
  await tester.pumpWidget(PreviewApp(initialScreen: page));
  await tester.pumpAndSettle();
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  setUpAll(() async {
    for (final font in {
      'Nunito': 'Nunito-VariableFont_wght.ttf',
      'Nunito Sans': 'NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf',
    }.entries) {
      await (FontLoader(
        font.key,
      )..addFont(rootBundle.load('assets/fonts/${font.value}'))).load();
    }
  });
  testWidgets(
    'home navigates to agenda and preserves the empty reference state',
    (tester) async {
      await open(tester, 'home');
      expect(find.text('Não há feed disponíveis.'), findsOneWidget);
      await tester.tap(find.text('Ver Tudo'));
      await tester.pumpAndSettle();
      expect(find.text('Setembro 2026'), findsOneWidget);
      expect(find.text('Não há atendimentos agendados.'), findsOneWidget);
      expect(tester.takeException(), isNull);
    },
  );
  testWidgets('content search hides unmatched synthetic content', (
    tester,
  ) async {
    await open(tester, 'contents');
    expect(find.text('Teste v1'), findsOneWidget);
    await tester.enterText(find.byType(TextField), 'inexistente');
    await tester.pumpAndSettle();
    expect(find.text('Teste v1'), findsNothing);
    expect(find.text('Não há conteúdos disponíveis.'), findsOneWidget);
  });
  testWidgets('demo login switches controllers and reaches home', (
    tester,
  ) async {
    await open(tester, 'login');
    await tester.enterText(find.byType(TextField), '00000000000');
    await tester.pumpAndSettle();
    await tester.tap(find.text('PRÓXIMO'));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField), 'demo-local-123');
    await tester.pumpAndSettle();
    await tester.tap(find.text('ENTRAR'));
    await tester.pumpAndSettle();
    expect(find.text('Não há feed disponíveis.'), findsOneWidget);
  });
  for (final page in [
    'metrics',
    'settings',
    'login',
    'library',
    'feed',
    'notifications',
    'password',
  ]) {
    testWidgets('$page renders without overflow at the recorded phone size', (
      tester,
    ) async {
      await open(tester, page);
      expect(tester.takeException(), isNull);
    });
  }
}
