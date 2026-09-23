import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:bloomy_design_preview/main.dart';
import 'package:bloomy_design_preview/preview_fixture.dart';
import 'package:components_bloomy/components_bloomy.dart';

Future<void> open(
  WidgetTester tester,
  String page, {
  PreviewFixture? fixture,
  String? component,
}) async {
  tester.view.physicalSize = const Size(402, 874);
  tester.view.devicePixelRatio = 1;
  addTearDown(tester.view.resetPhysicalSize);
  addTearDown(tester.view.resetDevicePixelRatio);
  await tester.pumpWidget(
    PreviewApp(initialScreen: page, fixture: fixture, component: component),
  );
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
  testWidgets(
    'custom fixture changes native content and empty fixture removes it',
    (tester) async {
      await open(
        tester,
        'contents',
        fixture: const PreviewFixture(
          patient: 'Paciente Exemplo',
          contentTitle: 'Exemplo editado',
        ),
      );
      expect(find.text('Paciente Exemplo'), findsOneWidget);
      expect(find.text('Exemplo editado'), findsOneWidget);
      await tester.pumpWidget(const SizedBox());
      await open(
        tester,
        'contents',
        fixture: const PreviewFixture(showContent: false),
      );
      expect(find.text('Teste v1'), findsNothing);
      expect(find.text('Não há conteúdos disponíveis.'), findsOneWidget);
    },
  );
  testWidgets('component fixture disables the actual Flutter button', (
    tester,
  ) async {
    await open(
      tester,
      'library',
      component: 'CButton',
      fixture: const PreviewFixture(
        buttonEnabled: false,
        buttonLabel: 'INDISPONÍVEL',
      ),
    );
    expect(
      tester
          .widget<CButton>(find.widgetWithText(CButton, 'INDISPONÍVEL'))
          .data
          .isEnabled,
      isFalse,
    );
    await tester.tap(find.text('INDISPONÍVEL'));
    await tester.pumpAndSettle();
    expect(find.text('Prévia local'), findsNothing);
  });
  for (final component in [
    'CAppBarUser2',
    'CBottomBarUser',
    'CCalendarWeekly',
    'CTextField',
    'CContainerListInformation',
    'CTileParentContent',
    'CTileSettings',
  ]) {
    testWidgets('isolated $component renders the original widget', (
      tester,
    ) async {
      await open(tester, 'library', component: component);
      expect(tester.takeException(), isNull);
    });
  }
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
