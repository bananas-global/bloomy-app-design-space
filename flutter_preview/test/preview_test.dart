import 'dart:convert';
import 'dart:io';
import 'image_client.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/services.dart';
import 'package:flutter/material.dart';
import 'package:bloomy_design_preview/main.dart';
import 'package:bloomy_design_preview/preview_fixture.dart';
import 'package:components_bloomy/components_bloomy.dart' hide CAvatarUpdater;
import 'package:bloomy_design_preview/avatar_updater_candidate.dart';

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
  debugNetworkImageHttpClientProvider = () => FixtureImageClient();
  await tester.pumpWidget(
    PreviewApp(initialScreen: page, fixture: fixture, component: component),
  );
  if (fixture?.state == 'loading' ||
      fixture?.resolvedFeedState == 'loading' ||
      fixture?.resolvedScheduleState == 'loading') {
    await tester.pump(const Duration(milliseconds: 500));
  } else {
    await tester.pumpAndSettle();
  }
  debugNetworkImageHttpClientProvider = null;
}

void main() {
  testWidgets('profile avatars use each person name as initials fallback', (tester) async {
    await open(tester, 'settings', fixture: const PreviewFixture(settingsGuardianPhoto: false, settingsPatientPhoto: false, legalGuardianName: 'Mariana Santos', patientName: 'Lucas Santos'));
    final avatars = tester.widgetList<CAvatar>(find.descendant(of: find.byType(CAvatarUpdater), matching: find.byType(CAvatar))).toList();
    expect(avatars.map((avatar) => avatar.data.defaultAbbreviationName), containsAll(['MS', 'LS']));
    expect(avatars.every((avatar) => avatar.data.defaultPriority == DefaultPriority.abbreviation), isTrue);
  });

  testWidgets('profile row aligns portraits and editing follows the selected person', (tester) async {
    await open(tester, 'settings', fixture: const PreviewFixture(settingsProfileCount: '4', legalGuardianName: 'Mariana Santos', patientName: 'Lucas Santos'));
    final avatars = find.descendant(of: find.byType(CAvatarUpdater), matching: find.byType(CAvatar));
    expect(avatars, findsNWidgets(4));
    final rects = List.generate(4, (i) => tester.getRect(avatars.at(i)));
    expect(rects.first.size, const Size(124, 124));
    for (final rect in rects.skip(1)) {
      expect(rect.size, const Size(52, 52));
      expect(rect.bottom, closeTo(rects.first.bottom, .01));
    }
    await tester.tap(find.bySemanticsLabel('Trocar perfil'));
    await tester.pumpAndSettle();
    expect(find.bySemanticsLabel('Editar foto de Lucas Santos'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('avatar editor opens the real source sheet and dismisses on selection', (tester) async {
    await open(tester, 'settings');
    final updater = tester.widget<CAvatarUpdater>(find.byType(CAvatarUpdater));
    await tester.tap(find.bySemanticsLabel('Editar foto de ${updater.data.avatarUsersData.first.title}'));
    await tester.pumpAndSettle();
    expect(find.byType(CBottomSheetInternalScreen), findsOneWidget);
    expect(find.text('SELECIONE'), findsOneWidget);
    expect(find.text('GALERIA'), findsOneWidget);
    expect(find.text('CAMERA'), findsOneWidget);
    final bottomGap = tester.view.physicalSize.height / tester.view.devicePixelRatio - tester.getBottomRight(find.byType(CBottomSheetInternalScreen)).dy;
    expect(bottomGap, greaterThanOrEqualTo(34));
    await tester.tap(find.text('GALERIA'));
    await tester.pumpAndSettle();
    expect(find.byType(CBottomSheetInternalScreen), findsNothing);
    expect(find.text('Galeria selecionada. A escolha de arquivo é simulada nesta prévia.'), findsOneWidget);
  });

  test('fixture contracts accept separated data and legacy links', () {
    final fixture = PreviewFixture.fromJson(jsonEncode({
      'data': {'legalGuardianName': 'Mariana', 'patientName': 'Lucas', 'roomName': '', 'isEnabled': false},
      'preview': {'headerPhoto': true, 'feedCount': '3'},
    }));
    expect(fixture.legalGuardianName, 'Mariana');
    expect(fixture.patientName, 'Lucas');
    expect(fixture.roomName, '');
    expect(fixture.isEnabled, false);
    expect(fixture.headerPhoto, true);
    expect(fixture.postCount, 3);
    final legacy = PreviewFixture.fromJson(jsonEncode({'guardian': 'Mariana', 'patient': 'Lucas', 'buttonEnabled': false, 'scheduleRoom': 'none'}));
    expect(legacy.legalGuardianName, fixture.legalGuardianName);
    expect(legacy.patientName, fixture.patientName);
    expect(legacy.isEnabled, fixture.isEnabled);
    expect(legacy.roomName, fixture.roomName);
  });

  TestWidgetsFlutterBinding.ensureInitialized();
  final componentUsage = <String, Set<String>>{};
  tearDownAll(() {
    if (componentUsage.isEmpty) return;
    final sorted = componentUsage.keys.toList()..sort();
    final output = <String, List<String>>{
      for (final component in sorted)
        component: componentUsage[component]!.toList()..sort(),
    };
    File('../src/component-usage.generated.json').writeAsStringSync(
      '${const JsonEncoder.withIndent('  ').convert(output)}\n',
    );
  });
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
  testWidgets('settings uses the supplied guardian and patient photos', (tester) async {
    await open(tester, 'settings');
    final updater = tester.widget<CAvatarUpdater>(find.byType(CAvatarUpdater));
    expect(updater.data.avatarUsersData[0].avatarUrl.toString(), contains('avatar_mother.jpg'));
    expect(updater.data.avatarUsersData[1].avatarUrl.toString(), contains('avatar_lucas.jpg'));
    expect(tester.takeException(), isNull);
  });
  testWidgets('structural component samples use their real screen slots', (tester) async {
    await open(tester, 'home');
    final headerRect = tester.getRect(find.byType(CAppBarUser2));
    final bottomRect = tester.getRect(find.byType(CBottomBarUser));
    await tester.pumpWidget(const SizedBox.shrink());
    await open(tester, 'library', component: 'CBottomBarUser');
    expect(tester.getRect(find.byType(CBottomBarUser)), bottomRect);
    expect(find.text('CBottomBarUser'), findsNothing);
    await tester.pumpWidget(const SizedBox.shrink());
    await open(tester, 'library', component: 'CAppBarUser2');
    expect(tester.getRect(find.byType(CAppBarUser2)), headerRect);
    expect(find.text('CAppBarUser2'), findsNothing);
    expect(tester.takeException(), isNull);
  });
  testWidgets('live fixtures preserve preview state and scroll offset', (
    tester,
  ) async {
    await open(
      tester,
      'home',
      fixture: const PreviewFixture(
        feedState: 'empty',
        scheduleState: 'ready',
        scheduleCount: '3',
      ),
    );
    final state = tester.state(find.byType(Preview));
    final scroll = tester.state<ScrollableState>(find.byType(Scrollable).first);
    scroll.position.jumpTo(20);
    final offset = scroll.position.pixels;
    await tester.pumpWidget(
      const PreviewApp(
        initialScreen: 'home',
        fixture: PreviewFixture(
          legalGuardianName: 'Marina',
          feedState: 'loading',
          scheduleState: 'ready',
          scheduleCount: '3',
        ),
      ),
    );
    await tester.pump(const Duration(milliseconds: 100));
    expect(tester.state(find.byType(Preview)), same(state));
    expect(scroll.position.pixels, offset);
    expect(find.text('Marina'), findsOneWidget);
    expect(find.byType(CLoading), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
  for (final entry
      in jsonDecode(File('test/variation_cases.json').readAsStringSync())
          as List) {
    testWidgets('catalog ${entry['target']} / ${entry['id']}', (tester) async {
      final target = entry['target'] as String;
      await open(
        tester,
        (target.startsWith('C') || target.endsWith('Section'))
            ? 'library'
            : target,
        component: (target.startsWith('C') || target.endsWith('Section'))
            ? target
            : null,
        fixture: PreviewFixture.fromJson(jsonEncode(entry['data'])),
      );
      if (!(target.startsWith('C') || target.endsWith('Section'))) {
        for (final element in find.byWidgetPredicate((_) => true).evaluate()) {
          final widget = element.widget;
          final name = widget.key is ValueKey<String> &&
                  (widget.key as ValueKey<String>).value.endsWith('Section')
              ? (widget.key as ValueKey<String>).value
              : widget.runtimeType.toString();
          (componentUsage[name] ??= <String>{}).add(target);
        }
      }
      final id = entry['id'];
      if (id == 'populated') {
        if (target == 'home' || target == 'feed') {
          expect(find.byType(CCardFeed), findsWidgets);
        }
        if (target == 'home' || target == 'agenda') {
          expect(find.byType(CTileScheduleParent), findsNWidgets(2));
          final tiles = tester.widgetList<CTileScheduleParent>(
            find.byType(CTileScheduleParent),
          );
          expect(tiles.first.data.patientName, 'Lucas Santos');
          expect(tiles.first.data.startDateTime, DateTime(2026, 9, 23, 14));
        }
      }
      if (id == 'permissions-on' || id == 'permissions-off') {
        final values = tester
            .widgetList<CTileSettings>(find.byType(CTileSettings))
            .map((w) => w.data)
            .whereType<CTileSettingsCheckboxData>();
        expect(values, isNotEmpty);
        expect(
          values.every((v) => v.isChecked == (id == 'permissions-on')),
          isTrue,
        );
      }

      if (id == 'loading') {
        expect(find.byType(CLoading), findsNWidgets(target == 'home' ? 2 : 1));
        if (target == 'home') {
          expect(find.text('FEED'), findsOneWidget);
          expect(find.text('PRÓXIMOS ATENDIMENTOS'), findsOneWidget);
          for (final loader in find.byType(CLoading).evaluate()) {
            expect(
              tester
                  .getSize(
                    find.byElementPredicate(
                      (element) => identical(element, loader),
                    ),
                  )
                  .width,
              tester
                  .getSize(
                    find.byElementPredicate(
                      (element) => identical(element, loader),
                    ),
                  )
                  .height,
            );
            expect(
              tester
                  .getSize(
                    find.byElementPredicate(
                      (element) => identical(element, loader),
                    ),
                  )
                  .height,
              lessThan(100),
            );
          }
        }
      }
      if (id == 'error' && target == 'home') {
        expect(find.text('Erro ao recuperar o vídeo do feed.'), findsOneWidget);
        expect(
          find.text('Erro ao recuperar os atendimentos agendados.'),
          findsOneWidget,
        );
      }
      if (id == 'error' && target != 'home')
        expect(
          find.text(
            ['feed', 'FeedSection'].contains(target)
                ? 'Erro ao recuperar o vídeo do feed.'
                : ['agenda', 'AppointmentsSection'].contains(target)
                ? 'Erro ao recuperar os atendimentos agendados.'
                : 'Não foi possível carregar os dados.',
          ),
          findsOneWidget,
        );
      if (id == 'week')
        expect(
          tester
              .widget<CCalendarWeekly>(find.byType(CCalendarWeekly))
              .data
              .initialFormat,
          CalendarFormat.weekly,
        );
      if (id == 'password') expect(find.text('Senha'), findsOneWidget);
      if (id == 'field-error')
        expect(find.text('Revise o termo informado.'), findsOneWidget);
      if (id == 'search-filled')
        expect(
          tester.widget<TextField>(find.byType(TextField)).controller!.text,
          'Teste',
        );
      if (id == 'document')
        expect(
          tester
              .widget<CTileParentContent>(find.byType(CTileParentContent))
              .data
              .contentType,
          ContentType.document,
        );
      if (id == 'nav-agenda')
        expect(
          tester
              .widget<CBottomBarUser>(find.byType(CBottomBarUser))
              .data
              .currentPath,
          'agenda',
        );
      expect(tester.takeException(), isNull);
    });
  }
  testWidgets('home limits legacy three-post fixture with schedules loading', (
    tester,
  ) async {
    await open(
      tester,
      'home',
      fixture: const PreviewFixture(
        feedState: 'ready',
        feedCount: '3',
        scheduleState: 'loading',
        postText: 'long',
        headerPhoto: true,
        postAvatarPhoto: true,
      ),
    );
    expect(find.byType(CCardFeed), findsOneWidget);
    expect(find.byType(CLoading), findsOneWidget);
    expect(find.byType(CTileScheduleParent), findsNothing);
    final post = tester.widget<CCardFeed>(find.byType(CCardFeed).first);
    expect(post.data.description.length, greaterThan(300));
    expect(post.data.avatarUrl.toString(), contains('avatar_lucas.jpg'));
    expect(tester.takeException(), isNull);
  });
  testWidgets('home composes feed loading with three supervised appointments', (
    tester,
  ) async {
    await open(
      tester,
      'home',
      fixture: const PreviewFixture(
        feedState: 'loading',
        scheduleState: 'ready',
        scheduleCount: '3',
        hasSupervisor: true,
        professionalPhoto: true,
        status: 'cancelled',
      ),
    );
    expect(find.byType(CLoading), findsOneWidget);
    expect(find.byType(CCardFeed), findsNothing);
    expect(find.byType(CTileScheduleParent), findsNWidgets(3));
    final appointment = tester.widget<CTileScheduleParent>(
      find.byType(CTileScheduleParent).first,
    );
    expect(appointment.data.hasSupervisor, isTrue);
    expect(appointment.data.status, ScheduleStatus.cancelled);
    expect(tester.takeException(), isNull);
  });
  for (final count in ['1', '2', '3']) {
    testWidgets('home limits feed count $count to one post', (tester) async {
      final fixture = PreviewFixture(
        feedState: 'ready',
        feedCount: count,
        scheduleState: 'empty',
      );
      await open(tester, 'home', fixture: fixture);
      expect(find.byType(CCardFeed), findsOneWidget);
      await tester.pumpWidget(const SizedBox.shrink());
      await open(tester, 'library', component: 'FeedSection', fixture: fixture);
      expect(find.byType(CCardFeed), findsNWidgets(int.parse(count)));
      expect(tester.takeException(), isNull);
    });
  }
  testWidgets('home navigates to agenda and preserves the empty state', (
    tester,
  ) async {
    await open(tester, 'home');
    expect(find.text('Não há feed disponíveis.'), findsOneWidget);
    await tester.tap(find.text('Ver Tudo'));
    await tester.pumpAndSettle();
    expect(find.text('Setembro 2026'), findsOneWidget);
    expect(find.text('Não há atendimentos agendados.'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });
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
          patientName: 'Paciente Exemplo',
          title: 'Exemplo editado',
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
        isEnabled: false,
        label: 'INDISPONÍVEL',
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
