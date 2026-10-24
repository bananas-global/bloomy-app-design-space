import 'package:components_bloomy/components_bloomy.dart' hide CAvatarUpdater;
import 'package:flutter_extension/flutter_extension.dart' hide context;
import 'package:flutter_svg/flutter_svg.dart';
import 'package:global_messages/global_messages.dart';

import 'agreements_preview.dart';
import 'app_icons.dart';
import 'avatar_updater_candidate.dart';
import 'preview_bridge.dart';
import 'preview_fixture.dart';
import 'widgets/card_color.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SemanticsBinding.instance.ensureSemantics();
  runApp(const PreviewApp());
}

class PreviewApp extends StatefulWidget {
  const PreviewApp({this.fixture, this.component, this.initialScreen, super.key});

  final PreviewFixture? fixture;
  final String? component;
  final String? initialScreen;

  @override
  State<PreviewApp> createState() => _PreviewAppState();

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty<PreviewFixture?>('fixture', fixture))
      ..add(StringProperty('component', component))
      ..add(StringProperty('initialScreen', initialScreen));
  }
}

class _PreviewAppState extends State<PreviewApp> {
  final _controller = DesignSystemController(
    themeModeSelected: ThemeMode.light,
    supportedThemeDatas: [const BloomyThemeData()],
    localeSelected: const Locale('pt', 'BR'),
    supportedLocales: const [Locale('pt', 'BR')],
    // ignore: avoid_redundant_argument_values
    localizationFilesPath: 'assets/translations',
  );

  @override
  Widget build(BuildContext context) => DesignSystemBuilder(
    controller: _controller,
    builder: (context, mode, light, dark, locale, delegates, locales) => MaterialApp(
      navigatorKey: GlobalMessages.navigatorKey,
      scaffoldMessengerKey: GlobalMessages.scaffoldMessengerKey,
      debugShowCheckedModeBanner: false,
      theme: light,
      darkTheme: dark,
      themeMode: ThemeMode.light,
      locale: locale,
      localizationsDelegates: delegates,
      supportedLocales: locales,
      home: Preview(
        fixture: widget.fixture,
        component: widget.component,
        initialScreen: widget.initialScreen,
      ),
      builder: (context, child) => MediaQuery(
        data: MediaQuery.of(context).copyWith(
          padding: Uri.base.queryParameters['safe'] == '0' ? EdgeInsets.zero : const EdgeInsets.only(top: 62, bottom: 34),
          viewPadding: Uri.base.queryParameters['safe'] == '0' ? EdgeInsets.zero : const EdgeInsets.only(top: 62, bottom: 34),
          textScaler: const TextScaler.linear(1.1),
        ),
        child: child!,
      ),
    ),
  );
}

class Preview extends StatefulWidget {
  const Preview({this.fixture, this.component, this.initialScreen, super.key});

  final PreviewFixture? fixture;
  final String? component;
  final String? initialScreen;

  @override
  State<Preview> createState() => _PreviewState();

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty<PreviewFixture?>('fixture', fixture))
      ..add(StringProperty('component', component))
      ..add(StringProperty('initialScreen', initialScreen));
  }
}

class _PreviewState extends State<Preview> {
  late PreviewFixture _fixture = widget.fixture ?? PreviewFixture.fromJson(Uri.base.queryParameters['data']);
  late String _page = widget.initialScreen ?? Uri.base.queryParameters['screen'] ?? 'home';
  late String _patient = _fixture.patientName;

  late final _search = TextEditingController(text: _fixture.searchText);
  final _cpf = TextEditingController();
  final _password = TextEditingController();
  final _calendar = CalendarWeeklyController();
  DateTime _day = DateTime(2026, 9, 23);

  bool _keep = true;
  late bool _passwordStep = _fixture.loginStep == 'password';
  late bool _recoveryByPhone = _fixture.recoveryContacts != 'email';
  late bool _recoverySent = _fixture.recoverySent;
  late List<bool> _permissions = _fixture.permissions == 'on'
      ? [true, true, true]
      : _fixture.permissions == 'off'
      ? [false, false, false]
      : [true, false, false];

  late final void Function() _stopFixtureListener;
  final _labels = {
    'home': 'Início',
    'contents': 'Conteúdos',
    'metrics': 'Evolutivo',
    'agenda': 'Agenda',
    'contracts': 'Contratos',
    'feed': 'Feed',
    'notifications': 'Notificações',
    'settings': 'Configurações',
  };

  String avatarPhoto(String role) => (['http', 'https'].contains(Uri.base.scheme) ? Uri.base : Uri.parse('http://localhost/flutter/'))
      .resolve('assets/assets/images/avatar_$role.jpg')
      .toString();

  String get _sampleMedia => Uri.base.resolve('assets/assets/images/feed_activity.png').toString();

  CAvatarData get _avatar => CAvatarData(
    imageUrl: _fixture.headerPhoto ? avatarPhoto('mother') : '',
    defaultAbbreviationName: 'TS',
  );

  @override
  void initState() {
    super.initState();
    _stopFixtureListener = listenFixtures((data) {
      if (!mounted) return;
      updateFixture(PreviewFixture.fromJson(data));
    });
  }

  void updateFixture(PreviewFixture next) {
    setState(() {
      if (next.patientName != _fixture.patientName) _patient = next.patientName;
      if (next.searchText != _fixture.searchText) _search.text = next.searchText;
      if (next.loginStep != _fixture.loginStep) {
        _passwordStep = next.loginStep == 'password';
      }
      if (next.recoveryContacts != _fixture.recoveryContacts) {
        _recoveryByPhone = next.recoveryContacts != 'email';
      }
      if (next.recoverySent != _fixture.recoverySent) {
        _recoverySent = next.recoverySent;
      }
      if (next.permissions != _fixture.permissions) {
        _permissions = next.permissions == 'on'
            ? [true, true, true]
            : next.permissions == 'off'
            ? [false, false, false]
            : [true, false, false];
      }
      if (next.calendarMode != _fixture.calendarMode) {
        next.calendarMode == 'week' ? _calendar.changeToWeekly() : _calendar.changeToMonthly();
      }
      _fixture = next;
    });
  }

  @override
  void didUpdateWidget(covariant Preview oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.fixture != null && widget.fixture != oldWidget.fixture) {
      updateFixture(widget.fixture!);
    }
  }

  void go(String next) {
    setState(() {
      _page = next;
      _search.clear();
    });
    notifyScreen(next);
  }

  @override
  void dispose() {
    _stopFixtureListener();
    _calendar.dispose();
    _search.dispose();
    _cpf.dispose();
    _password.dispose();
    super.dispose();
  }

  void message(String text) => showDialog<void>(
    context: context,
    builder: (c) => AlertDialog(
      title: const Text('Prévia local'),
      content: Text(text),
      actions: [
        TextButton(
          onPressed: () => Navigator.pop(c),
          child: const Text('Fechar'),
        ),
      ],
    ),
  );

  Icone icon(String id, bool selected) => switch (id) {
    'home' => selected ? UIconsExtension.selectHome : UIconsExtension.unselectHome,
    'contents' => selected ? UIconsExtension.selectTrainings : UIconsExtension.unselectTrainings,
    'metrics' => selected ? UIconsExtension.selectGraphics : UIconsExtension.unselectGraphics,
    'agenda' => selected ? UIconsExtension.selectSchedules : UIconsExtension.unselectSchedules,
    'contracts' => selected ? UIconsExtension.selectContracts : UIconsExtension.unselectContracts,
    'feed' => selected ? UIconsExtension.selectFeeds : UIconsExtension.unselectFeeds,
    'notifications' => selected ? UIconsExtension.selectNotifications : UIconsExtension.unselectNotifications,
    _ => selected ? UIconsExtension.selectSettings : UIconsExtension.unselectSettings,
  };

  CBottomBarUser bottom() => CBottomBarUser(
    CBottomBarUserData(
      itemsData: [
        for (final id in ['home', 'contents', 'metrics', 'agenda'])
          CBottomBarUserItemData(
            selectIcon: icon(id, true),
            unselectIcon: icon(id, false),
            label: _labels[id]!,
            itemPath: id,
          ),
        if (_page == 'settings' || _page == 'metrics')
          CBottomBarUserItemData(
            selectIcon: icon('settings', true),
            unselectIcon: icon('settings', false),
            label: 'Configurações',
            itemPath: 'settings',
          )
        else
          CBottomBarUserItemUserData(
            allIcon: UIconsExtension.allUsers,
            allLabel: 'Todos',
            selectablePatients: const [],
            baseUrl: '',
          ),
      ],
      currentPath: _page == 'library' ? _fixture.navigation : _page,
    ),
    const CBottomBarUserDefaultStyle(),
    onUserTap: selectPatient,
    onItemTap: (id) => go(id as String),
  );

  Future<void> selectAvatarSource() async {
    final source = await showBottomSheetScreen<String>(
      const BottomSheetScreenData(isLimitedHeightByRatio: true),
      const BottomSheetScreenDefaultStyle(),
      parentContext: context,
      builder: (sheetContext) => Padding(
        // The web preview supplies the simulated device inset explicitly.
        padding: EdgeInsets.only(
          bottom: MediaQuery.viewPaddingOf(context).bottom,
        ),
        child: CBottomSheetInternalScreen(
          CBottomSheetInternalScreenData(
            fixSpaceInIOS: false,
            appBarTitleData: CAppBarTitleBottomSheetData(
              title: 'SELECIONE',
              showDivider: false,
            ),
          ),
          const CBottomSheetInternalScreenDefaultStyle(),
          onCloseTap: () => Navigator.of(sheetContext).pop(),
          body: const SizedBox.shrink(),
          bottomBar: CBottomBarButtons.horizontal(
            CBottomBarButtonsHorizontalData(
              leftButtonData: CButton2LabelAndIconData(
                'GALERIA',
                UIcons.gallery,
              ),
              rightButtonData: CButton2LabelAndIconData(
                'CAMERA',
                UIcons.camera,
              ),
            ),
            const CBottomBarButtonsBottomSheetStyle(),
            onLeftButtonTap: () => Navigator.of(sheetContext).pop('gallery'),
            onRightButtonTap: () => Navigator.of(sheetContext).pop('camera'),
          ),
        ),
      ),
    );
    if (!mounted || source == null) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          source == 'gallery'
              ? 'Galeria selecionada. A escolha de arquivo é simulada nesta prévia.'
              : 'Câmera selecionada. A captura é simulada nesta prévia.',
        ),
      ),
    );
  }

  void selectPatient() => showModalBottomSheet<void>(
    context: context,
    builder: (c) => SafeArea(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Padding(
            padding: EdgeInsets.all(20),
            child: Text('Selecionar pacientes'),
          ),
          for (final name in ['Todos', _fixture.patientName, 'Teste João'])
            ListTile(
              title: Text(name),
              trailing: _patient == name ? const Icon(Icons.check) : null,
              onTap: () {
                setState(() => _patient = name);
                Navigator.pop(c);
              },
            ),
        ],
      ),
    ),
  );

  Widget drawer() => CDrawer(
    CDrawerData(
      name: Name(_fixture.legalGuardianName),
      email: const Email('responsavel@example.invalid'),
      avatarData: _avatar,
      itemsData: [
        for (final id in _labels.keys)
          CDrawerItemData(
            selectIcon: icon(id, true),
            unselectIcon: icon(id, false),
            label: _labels[id]!,
            itemPath: id,
          ),
      ],
      quitItemData: CDrawerItemData.button(icon: UIcons.quit, label: 'Sair'),
      currentPath: _page == 'library' ? _fixture.navigation : _page,
    ),
    const CDrawerDefaultStyle(),
    onUserTap: () {
      Navigator.pop(context);
      go('settings');
    },
    onItemTap: (id) {
      Navigator.pop(context);
      go(id as String);
    },
    onQuit: () {
      Navigator.pop(context);
      go('login');
    },
  );

  IAppBar header(BuildContext ctx) => CAppBarUser2(
    CAppBarUser2Data(
      greetings: 'Olá,',
      name: _fixture.legalGuardianName,
      avatarData: _avatar,
      buttonData: CButtonData.icon(UIconsExtension.menu),
    ),
    const CAppBarUser2DefaultStyle(),
    onUserTap: () => go('settings'),
    onButtonTap: () => Scaffold.of(ctx).openDrawer(),
    bottom: _page == 'agenda'
        ? agendaHeader()
        : _page == 'contents'
        ? CTextField(
            CTextFieldData.search(hint: 'Buscar por nome, área, protocolo...'),
            const CTextFieldDefaultStyle(
              customMargin: EdgeInsets.symmetric(horizontal: 16),
            ),
            controller: _search,
            onChanged: (_) => setState(() {}),
          )
        : _page == 'metrics'
        ? Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: CDropdown<String>(
              CDropdownData<String>(
                items: [
                  CDropdownItemData(
                    label: _fixture.patientName,
                    value: _fixture.patientName,
                  ),
                  const CDropdownItemData(label: 'Teste João', value: 'Teste João'),
                ],
                valueSelected: _patient == 'Todos' ? _fixture.patientName : _patient,
              ),
              const CDropdownDefaultStyle(),
              onSelect: (v) => setState(() => _patient = v),
            ),
          )
        : null,
  );

  Widget statePreview() => _fixture.state == 'loading'
      ? const Center(child: CLoading(CLoadingData(), CLoadingParentStyle()))
      : CContainerListInformation(
          CContainerListInformationData(
            icon: UIconsExtension.contentError,
            description: 'Não foi possível carregar os dados.',
          ),
          const CContainerListInformationNotFoundStyle(),
        );

  Widget empty(bool feed) => CContainerListInformation(
    CContainerListInformationData(
      icon: feed ? UIconsExtension.contentEmpty : UIconsExtension.calendarEmpty,
      description: feed ? 'Não há feed disponíveis.' : 'Não há atendimentos agendados.',
    ),
    const CContainerListInformationNotAvailableStyle(),
  );

  Widget agendaHeader() => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 16),
    child: Column(
      children: [
        Row(
          children: [
            Expanded(
              child: CTextField(
                CTextFieldData.search(hint: 'Buscar por paciente, sala...'),
                const CTextFieldDefaultStyle(),
                controller: _search,
                onChanged: (_) => setState(() {}),
              ),
            ),
            ListenableBuilder(
              listenable: _calendar,
              builder: (_, _) => CButton(
                CButtonData.icon(
                  _calendar.format == CalendarFormat.monthly ? UIcons.formatMonth : UIcons.formatWeek,
                ),
                const CButtonBackStyle(),
                onTap: () {
                  _calendar.format == CalendarFormat.monthly ? _calendar.changeToWeekly() : _calendar.changeToMonthly();
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        CCalendarWeekly(
          CCalendarWeeklyData(
            initialFormat: _fixture.calendarMode == 'week' ? CalendarFormat.weekly : CalendarFormat.monthly,
            holidayData: HolidayDataCustom(
              statutoryHolidays: const [],
              floatingHolidays: [
                DateTime(2026, 9, 5),
                DateTime(2026, 9, 6),
                DateTime(2026, 9, 7),
                DateTime(2026, 10, 10),
              ],
            ),
            initialCurrentDate: DateTime(2026, 9, 23),
            initialSelectDate: DateTime(2026, 9, 23),
            canSelectDateHasNull: false,
          ),
          const CCalendarWeeklyProfessionalStyle(),
          controller: _calendar,
          onDaySelected: (selected, _, _, _) => setState(() => _day = selected!),
        ),
      ],
    ),
  );

  Widget feedCard(int index) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
    child: CCardFeed(
      CCardFeedData(
        name: Name(_fixture.patientName),
        avatarUrl: Url(_fixture.postAvatarPhoto ? avatarPhoto('lucas') : ''),
        url: Url(_sampleMedia),
        thumbnailUrl: Url(_sampleMedia),
        type: _fixture.postMedia == 'video' ? FeedType.video : FeedType.image,
        duration: 45,
        description: switch (_fixture.postText) {
          'short' => 'Registro ilustrativo da atividade ${index + 1}.',
          'long' =>
            'Registro de demonstração da atividade ${index + 1}. Hoje exploramos cores, formas e diferentes maneiras de comunicar escolhas durante brincadeiras em grupo. A proposta incluiu momentos de cooperação, organização dos materiais e uma pausa entre as atividades. Este texto é fictício e serve para avaliar a leitura, as quebras de linha e a altura do card quando a descrição ocupa mais espaço. A imagem também é ilustrativa e não representa um atendimento real.',
          _ => 'Registro de demonstração da atividade ${index + 1}: comunicação e brincadeiras em grupo. Imagem ilustrativa.',
        },
        postedAt: DateTime(2026, 9, 23 - index, 11, 30),
        baseUrl: ['http', 'https'].contains(Uri.base.scheme) ? Uri.base.origin : 'http://localhost',
      ),
      const CCardFeedDefaultStyle(),
      onShareTap: (_, _) => message(
        'Compartilhamento disponível no aplicativo. Este registro é fictício.',
      ),
      onMidiaOpened: (_, _) => message('Imagem ilustrativa da amostra local.'),
    ),
  );

  CAvatarData sampleAvatar(String name) => CAvatarData(
    imageUrl: '',
    defaultAbbreviationName: name,
    defaultPriority: DefaultPriority.abbreviation,
  );

  Widget appointment(int index) => Padding(
    padding: const EdgeInsets.fromLTRB(24, 0, 24, 8),
    child: appointmentCard(index),
  );

  CTileScheduleParent appointmentCard(int index) => CTileScheduleParent(
    CTileScheduleParentData(
      id: 'sample-$index',
      patientName: _fixture.patientName,
      patientService: index == 0 ? 'Fonoaudiologia' : 'Terapia ocupacional',
      patientAvatarData: CAvatarData(
        imageUrl: (_fixture.schedulePatientPhoto == 'inherit' ? _fixture.postAvatarPhoto : _fixture.schedulePatientPhoto == 'true')
            ? avatarPhoto('lucas')
            : '',
        defaultAbbreviationName: _fixture.patientName,
        defaultPriority: DefaultPriority.abbreviation,
      ),
      hasProfessional: _fixture.hasProfessional,
      professionalName: index == 0 ? 'Ana Lima' : 'Paula Costa',
      professionalSpecialty: index == 0 ? 'Fonoaudióloga' : 'Terapeuta ocupacional',
      professionalAvatarData: CAvatarData(
        imageUrl: _fixture.professionalPhoto && index == 0 ? avatarPhoto('ana_lima') : '',
        defaultAbbreviationName: index == 0 ? 'Ana Lima' : 'Paula Costa',
        defaultPriority: DefaultPriority.abbreviation,
      ),
      legalGuardianName: _fixture.legalGuardianName,
      legalGuardianAvatarData: _avatar,
      hasSupervisor: _fixture.hasSupervisor,
      supervisorName: 'Bia Luz',
      supervisorSpecialty: 'SUPERVISOR',
      supervisorAvatarData: CAvatarData(
        imageUrl: '',
        defaultAbbreviationName: 'Bia Luz',
        defaultPriority: _fixture.supervisorInitials ? DefaultPriority.abbreviation : DefaultPriority.defaultImage,
      ),
      type: ScheduleType.patient,
      status: ScheduleStatus.fromString(_fixture.status),
      sessionType: SessionType.none,
      sessionLocation: SessionLocation.inClinic,
      startDateTime: _fixture.scheduleTime == 'none'
          ? null
          : DateTime(
              2026,
              9,
              23,
              _fixture.scheduleTime == '09:30' ? 9 : 14 + index,
              _fixture.scheduleTime == '09:30' ? 30 : 0,
            ),
      showFullStartDate: _fixture.showFullStartDate,
      endDateTime: DateTime(2026, 9, 23, 14 + index, 50),
      unitName: _fixture.unitName,
      roomName: _fixture.roomName == 'Sala 1' ? 'Sala ${index + 1}' : _fixture.roomName,
    ),
    CTileScheduleParentDefaultStyle(
      status: ScheduleStatus.fromString(_fixture.status),
    ),
    onTap: () => message(
      'Atendimento fictício de ${_fixture.patientName}, às ${14 + index}h, na Unidade Jardim, sala ${index + 1}.',
    ),
  );

  Widget homeSectionState(bool feed) => (feed ? _fixture.resolvedFeedState : _fixture.resolvedScheduleState) == 'loading'
      ? const Padding(
          padding: EdgeInsets.symmetric(vertical: 32),
          child: Center(child: CLoading(CLoadingData(), CLoadingParentStyle())),
        )
      : CContainerListInformation(
          CContainerListInformationData(
            icon: feed ? UIconsExtension.contentError : UIconsExtension.calendarError,
            description: feed ? 'Erro ao recuperar o vídeo do feed.' : 'Erro ao recuperar os atendimentos agendados.',
          ),
          const CContainerListInformationNotFoundStyle(),
        );

  Widget feedSection({bool withHeader = true, bool singlePost = false}) => Column(
    key: const ValueKey('FeedSection'),
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      if (withHeader)
        CHeader.content(
          const CHeaderContentData(
            'FEED',
            buttonData: CButton2LabelData('Acesse o feed completo'),
          ),
          const CHeaderDefaultStyle(isTop: true),
          onTap: () => go('feed'),
        ),
      if (['loading', 'error'].contains(_fixture.resolvedFeedState))
        homeSectionState(true)
      else if (_fixture.resolvedFeedState == 'ready')
        for (var i = 0; i < (singlePost ? 1 : _fixture.postCount); i++) feedCard(i)
      else
        empty(true),
    ],
  );

  Widget appointmentsSection({bool withHeader = true}) => Column(
    key: const ValueKey('AppointmentsSection'),
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      if (withHeader)
        CHeader.content(
          const CHeaderContentData(
            'PRÓXIMOS ATENDIMENTOS',
            buttonData: CButton2LabelData('Ver Tudo'),
          ),
          const CHeaderDefaultStyle(),
          onTap: () => go('agenda'),
        ),
      if (['loading', 'error'].contains(_fixture.resolvedScheduleState))
        homeSectionState(false)
      else if (_fixture.resolvedScheduleState == 'ready') ...[
        const SizedBox(height: 12),
        for (var i = 0; i < _fixture.appointmentCount; i++) appointment(i),
      ] else
        empty(false),
    ],
  );

  Widget home() => SingleChildScrollView(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        feedSection(singlePost: true),
        appointmentsSection(),
        const SizedBox(height: 16),
      ],
    ),
  );

  Widget feed() => SingleChildScrollView(child: feedSection(withHeader: false));

  Widget agenda() => SingleChildScrollView(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const SizedBox(height: 16),
        CHeader.content(
          CHeaderContentData(_day.toStringFormatted('dd "de" Month, yyyy')),
          const CHeaderDateTimeStyle(isHoliday: false),
        ),
        const SizedBox(height: 16),
        if (['loading', 'error'].contains(_fixture.resolvedScheduleState))
          homeSectionState(false)
        else if (_fixture.resolvedScheduleState == 'ready' && _day == DateTime(2026, 9, 23)) ...[
          for (var i = 0; i < _fixture.appointmentCount; i++)
            if ('${_fixture.patientName} Unidade Jardim Sala ${i + 1}'.toLowerCase().contains(_search.text.toLowerCase())) appointment(i),
          if (!'${_fixture.patientName} Unidade Jardim ${List.generate(_fixture.appointmentCount, (i) => 'Sala ${i + 1}').join(' ')}'
              .toLowerCase()
              .contains(_search.text.toLowerCase()))
            empty(false),
        ] else
          empty(false),
      ],
    ),
  );

  Widget contents() => SingleChildScrollView(
    padding: const EdgeInsets.symmetric(horizontal: 24),
    child: Column(
      children: [
        const Padding(
          padding: EdgeInsets.only(bottom: 12),
          child: CHeader.content(
            CHeaderContentData('CONTEÚDOS EDUCATIVOS'),
            CHeaderParentHomeStyle(),
          ),
        ),
        if (_fixture.showContent &&
            (_search.text.isEmpty || '${_fixture.title} ${_fixture.description}'.toLowerCase().contains(_search.text.toLowerCase())))
          Padding(padding: EdgeInsets.zero, child: contentTile())
        else
          const Padding(
            padding: EdgeInsets.all(24),
            child: Text('Não há conteúdos disponíveis.'),
          ),
      ],
    ),
  );

  Widget contentTile() => CTileParentContent(
    CTileParentContentData(
      patientName: _patient == 'Todos' ? _fixture.patientName : _patient,
      updatedAt: DateTime(2025, 10, 1, 17, 21),
      patientAvatarData: const CAvatarData(
        imageUrl: '',
        defaultAbbreviationName: 'TM',
        defaultPriority: DefaultPriority.abbreviation,
      ),
      title: _fixture.title,
      description: _fixture.description,
      contentType: _fixture.contentType == 'document' ? ContentType.document : ContentType.video,
      id: 'synthetic-content-1',
    ),
    const CTileParentContentDefaultStyle(),
    chips: const [
      CChip(CChipData.label('ABLLS-R'), CChipProtocolStyle()),
      CChip(
        CChipData.label('Cooperação e Eficácia do Reforçador (A)'),
        CChipAreaStyle(),
      ),
    ],
    onTap: () => go('content'),
  );

  Widget metrics() => SingleChildScrollView(
    child: Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: [
        const CHeader.content(
          CHeaderContentData('EVOLUTIVO'),
          CHeaderParentHomeStyle(),
        ),
        const CMetricCurrentArea(
          CMetricCurrentAreaData(areas: []),
          CMetricCurrentAreaDefaultStyle(),
        ),
        CMetricPhase(
          CMetricPhaseData(
            phases: [
              for (final (index, label) in [
                'Linha de base',
                'Intervenção',
                'Generalização',
                'Manutenção',
                'Adquirido',
              ].indexed)
                MetricPhaseEntity(
                  label: label,
                  position: index,
                  value: 0,
                  color: [
                    Colors.blue,
                    Colors.orange,
                    Colors.purple,
                    Colors.green,
                    Colors.teal,
                  ][index],
                ),
            ],
          ),
          const CMetricPhaseDefaultStyle(),
        ),
        const SizedBox(height: 120),
      ],
    ),
  );

  IAppBar backHeader(String title) => CAppBarRow(
    const CAppBarRowData(showDivider: false),
    const CAppBarRowParentBackStyle(),
    centerContent: CText(CTextData(title), const CTextParentDetailsStyle()),
    leftContent: CButtonBack<void>(
      CButtonBackData(),
      const CButtonBackDefaultStyle(),
      onTap: () => go('home'),
    ),
  );

  List<Widget> settings() => [
    CAvatarUpdater(
      CAvatarUpdaterData(
        avatarUsersData: [
          AvatarUserData(
            id: 'guardian',
            title: _fixture.legalGuardianName,
            avatarUrl: Url(
              _fixture.settingsGuardianPhoto ? avatarPhoto('mother') : '',
            ),
          ),
          if (_fixture.settingsProfileCount != '1')
            AvatarUserData(
              id: 'patient',
              title: _fixture.patientName,
              avatarUrl: Url(
                _fixture.settingsPatientPhoto ? avatarPhoto('lucas') : '',
              ),
            ),
          if (_fixture.settingsProfileCount == '4') ...[
            const AvatarUserData(
              id: 'patient-2',
              title: 'Sofia Santos',
              avatarUrl: Url(''),
            ),
            const AvatarUserData(
              id: 'patient-3',
              title: 'Pedro Santos',
              avatarUrl: Url(''),
            ),
          ],
        ],
      ),
      const CAvatarUpdaterDefaultStyle(),
      key: ValueKey(_fixture.settingsProfileCount),
      onAvatarTap: (_) => selectAvatarSource(),
    ),
    const CHeader.content(
      CHeaderContentData('SEGURANÇA'),
      CHeaderParentHomeStyle(),
    ),
    CCardList(
      const CCardListSettingsStyle(),
      children: [
        CTileSettings(
          CTileSettingsData(
            icon: UIcons.changePassword,
            label: 'Redefinir senha',
          ),
          const CTileSettingsSettingsStyle(
            customIconColor: Color(0xFF4094BB),
            isFirst: true,
            isLast: true,
          ),
          onTap: () => go('password'),
        ),
      ],
    ),
    const CHeader.content(
      CHeaderContentData('PERMISSÕES'),
      CHeaderParentHomeStyle(),
    ),
    CCardList(
      const CCardListSettingsStyle(),
      children: [
        for (final (i, label) in ['Notificações', 'Câmera', 'Galeria'].indexed)
          CTileSettings.checkbox(
            CTileSettingsCheckboxData(
              label: label,
              description: _fixture.settingsPlatform == 'android' ? '' : 'Configurações → Apps → Bloomy → ${i == 2 ? 'Fotos' : label}',
              icon: [UIcons.notificationOn, UIcons.camera, UIcons.gallery][i],
              isChecked: _permissions[i],
            ),
            CTileSettingsSettingsStyle(
              customIconColor: const Color(0xFF4094BB),
              isFirst: i == 0,
              isLast: i == 2,
            ),
            onChanged: (_) => setState(() => _permissions[i] = !_permissions[i]),
          ),
      ],
    ),
    const CHeader.content(
      CHeaderContentData('INFORMAÇÕES'),
      CHeaderParentHomeStyle(),
    ),
    CCardList(
      const CCardListSettingsStyle(),
      children: [
        for (final (i, label) in [
          'Termos de uso',
          'Termo de Ciência',
          'Sobre',
        ].indexed)
          CTileSettings(
            CTileSettingsData(
              icon: i == 2 ? UIcons.about : UIcons.termsOfUse,
              label: label,
            ),
            CTileSettingsSettingsStyle(
              customIconColor: const Color(0xFF4094BB),
              isFirst: i == 0,
              isLast: i == 2,
            ),
            onTap: () => go(['terms', 'consent', 'about'][i]),
          ),
      ],
    ),
  ];

  Widget changePassword() => CScaffold.list(
    const CScaffoldListData(isBodyUnderAppBar: false),
    const CScaffoldParentStyle(
      customListMainAxisAlignment: MainAxisAlignment.start,
    ),
    appBarBuilder: (_) => backHeader('Redefinir senha'),
    bodies: [
      const CTextContent(
        CTextContentData(
          title: 'Defina sua senha',
          subtitle:
              'Ela deve ter pelo menos 12 caracteres, incluindo letras, números e símbolos.\nEvite usar informações pessoais ou fáceis de serem adivinhadas, como data de nascimento ou nome completo.',
        ),
        CTextContentParentStyle(),
      ),
      for (final title in ['Senha antiga', 'Nova senha', 'Repetir senha']) ...[
        CTextField(
          CTextFieldData.password(
            title: title,
            hint: 'Digitar ${title.toLowerCase()}',
          ),
          const CTextFieldDefaultStyle(
            customMargin: EdgeInsets.symmetric(horizontal: 24),
          ),
        ),
        const SizedBox(height: 24),
      ],
    ],
    bottomBarBuilder: (_) => CBottomBarButton(
      CBottomBarButtonData(buttonData: CButtonData.label('SALVAR')),
      const CBottomBarButtonDefaultStyle(),
      onTap: () => message('Demonstração local: nenhuma senha foi alterada.'),
    ),
  );

  Widget document() => CScaffold.list(
    const CScaffoldListData(
      isBodyUnderAppBar: false,
      isBodyUnderBottomBar: false,
    ),
    const CScaffoldParentStyle(
      customListMainAxisAlignment: MainAxisAlignment.start,
    ),
    appBarBuilder: (_) => backHeader(
      {
        'terms': 'Termos de uso',
        'consent': 'Termo de Ciência',
        'contracts': 'Contrato de Adesão',
        'about': 'Sobre',
        'content': _fixture.title,
        'password': 'Redefinir senha',
      }[_page]!,
    ),
    bodies: [
      Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (_page == 'content') contentTile(),
            CText(
              CTextData(
                _page == 'about'
                    ? 'Bloomy\nABA Therapy\nVersão de referência: 1.10.3+89'
                    : _page == 'password'
                    ? 'Redefinição de senha simulada neste ambiente.'
                    : _page == 'content'
                    ? 'Prévia de conteúdo educativo. O vídeo da gravação não foi copiado.'
                    : 'Conteúdo documental fora do recorte visual validado. Esta tela demonstra o recipiente de leitura; não representa um contrato para aceite.',
              ),
              const CTextSimpleStyle(),
            ),
          ],
        ),
      ),
    ],
    bottomBarBuilder: (_) => bottom(),
  );

  Widget login() => CScaffold(
    const CScaffoldData(isAnyWidgetFocusedUnderKeyboard: true),
    const CScaffoldParentStyle(),
    appBarBuilder: (_) => _passwordStep
        ? CAppBarRow(
            const CAppBarRowData(showDivider: false),
            const CAppBarRowParentBackStyle(),
            leftContent: CButtonBack<void>(
              CButtonBackData(),
              const CButtonBackDefaultStyle(),
              onTap: () => setState(() => _passwordStep = false),
            ),
          )
        : const CAppBarEmpty(),
    body: Stack(
      children: [
        const Positioned.fill(
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                begin: Alignment(0.5, 0),
                end: Alignment(0.5, 1),
                colors: [Color(0xFFD7EBF2), Color.fromARGB(255, 181, 207, 217)],
              ),
            ),
          ),
        ),
        Positioned(
          width: MediaQuery.sizeOf(context).width,
          child: IgnorePointer(
            child: Transform.scale(
              alignment: const Alignment(0, -4),
              scale: 1.5,
              child: Image.asset(
                'assets/images/login_background_for_light2.png',
              ),
            ),
          ),
        ),
        Positioned.fill(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              SvgPicture.asset(
                'assets/images/app_logo.svg',
                width: MediaQuery.sizeOf(context).width * 4 / 5,
              ),
              const Spacer(flex: 4),
            ],
          ),
        ),
        Positioned.fill(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Spacer(flex: 3),
              SizedBox(
                height: 78,
                child: CTextField(
                  _passwordStep
                      ? CTextFieldData.password(
                          title: 'Senha',
                          hint: '********',
                        )
                      : CTextFieldData(
                          title: 'CPF do responsável',
                          hint: '123.456.789-00',
                          keyboardType: TextInputType.number,
                          inputFormatters: [
                            FilteringTextInputFormatter.digitsOnly,
                            const CpfInputFormatter(),
                          ],
                        ),
                  const CTextFieldLoginStyle(
                    customMargin: EdgeInsets.symmetric(horizontal: 24),
                  ),
                  key: ValueKey(_passwordStep),
                  controller: _passwordStep ? _password : _cpf,
                  onChanged: (_) => setState(() {}),
                ),
              ),
              const SizedBox(height: 24),
              if (!_passwordStep)
                const CText(
                  CTextData(
                    'Utilize o CPF do responsável cadastrado na bloomy. Você já precisa ter feito o cadastro na clínica para poder acessar o aplicativo.',
                  ),
                  CTextSimpleStyle(
                    customMargin: EdgeInsets.symmetric(horizontal: 24),
                  ),
                )
              else
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 24),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Flexible(
                        child: CCheckbox(
                          CCheckboxData<void>(
                            label: 'Manter conectado',
                            state: _keep ? SelectState.selected : SelectState.unselected,
                          ),
                          const CCheckboxLoginStyle(),
                          onChanged: (_, _) => setState(() => _keep = !_keep),
                        ),
                      ),
                      CButton(
                        CButtonData.label('Esqueci minha senha'),
                        const CButtonForgotPasswordStyle(),
                        onTap: () => go('password-recovery'),
                      ),
                    ],
                  ),
                ),
              const Spacer(flex: 2),
              const CVersion('1.10.3+89', CVersionDefaultStyle()),
              const SizedBox(height: 40),
            ],
          ),
        ),
      ],
    ),
    bottomBarBuilder: (_) => CBottomBarButton(
      CBottomBarButtonData(
        buttonData: CButtonData.label(
          _passwordStep ? 'ENTRAR' : 'PRÓXIMO',
          isEnabled: _passwordStep ? _password.text.isNotEmpty : _cpf.text.isNotEmpty,
        ),
        showDivider: false,
      ),
      const CBottomBarButtonLoginStyle(),
      onTap: () {
        if (_passwordStep) {
          go('home');
        } else {
          setState(() => _passwordStep = true);
        }
      },
    ),
  );

  /// Redesign of PasswordRecoveryScreen from the app 1.11.3+94 (unchanged in
  /// 1.13.0+98); commit 8e84c0b reproduces the original. Synthetic contacts;
  /// ENVIAR shows the app's notice and sends nothing.
  Widget passwordRecovery() {
    const phone = Phone.brazil('11987654321');
    const email = Email('responsavel@example.invalid');
    final hasBothData = _fixture.recoveryContacts == 'both';
    final isWhatsappShowed = _recoveryByPhone;
    final colors = context.theme<BloomyColors>();
    TextStyle text({FontWeight weight = FontWeight.w400, bool link = false}) => TextStyle(
      color: link ? colors?.primary.dark : colors?.text.main,
      fontSize: 16,
      fontWeight: link ? FontWeight.w700 : weight,
      height: 1.50,
      decoration: link ? TextDecoration.underline : null,
      decorationColor: link ? colors?.primary.dark : null,
    );
    return CScaffold(
      const CScaffoldData(isBodyUnderAppBar: false, isBodyUnderBottomBar: false, screenId: 'passwordRecoveryScreen'),
      const CScaffoldParentStyle(),
      appBarBuilder: (_) => CAppBarRow(
        const CAppBarRowData(showDivider: false),
        const CAppBarRowParentBackStyle(),
        leftContent: CButtonBack<void>(
          CButtonBackData(id: 'buttonBack'),
          const CButtonBackDefaultStyle(),
          onTap: () => go('login'),
        ),
        centerContent: const CText(
          CTextData('Envio de Link'),
          CTextParentDetailsStyle(),
        ),
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            width: 393,
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 16),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.center,
              spacing: 10,
              children: [
                Container(
                  width: 120,
                  height: 120,
                  decoration: ShapeDecoration(
                    color: isWhatsappShowed ? _whatsAppGreen.withValues(alpha: 0.10) : colors?.accent.op10,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(999)),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    mainAxisAlignment: MainAxisAlignment.center,
                    spacing: 10,
                    children: [
                      if (isWhatsappShowed)
                        CIcon(UIcons.whatsapp, const _WhatsAppIconStyle())
                      else
                        CIcon(UIcons.email, const CIconPasswordRecoveryStyle()),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // The app calls CHeader.title, whose build casts CHeaderTitleData to
          // CHeaderContentData and throws (components_bloomy 6.39.0–6.41.2). In
          // release builds the error box hides the rest of the body. The content
          // branch draws the same padded text with the same style.
          const CHeader.content(
            CHeaderContentData('Definir Senha'),
            CHeaderTitleStyle(),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Text.rich(
              TextSpan(
                children: [
                  TextSpan(
                    text: _recoverySent ? 'Enviamos uma mensagem para o seu ' : 'Enviaremos uma mensagem para o seu ',
                    style: text(),
                  ),
                  TextSpan(
                    text: isWhatsappShowed ? 'Número whatsapp' : 'Email',
                    style: text(weight: FontWeight.w700),
                  ),
                  TextSpan(text: ':', style: text()),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Semantics(
            identifier: isWhatsappShowed ? 'buttonPhone' : 'buttonEmail',
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: GestureDetector(
                onTap: () => message(
                  isWhatsappShowed ? 'No app, abre o WhatsApp. Nada é aberto nesta prévia.' : 'No app, abre o e-mail. Nada é aberto nesta prévia.',
                ),
                child: Text(
                  isWhatsappShowed
                      ? phone.toStringFormatted(Format.withMaskedPostfix)
                      : email.toStringMasked(EmailMaskFormat.option6, obscureCharacter: '.'),
                  style: text(link: true),
                ),
              ),
            ),
          ),
          const SizedBox(height: 8),
          const CText(
            CTextData('Basta seguir as instruções no link para criar a sua senha de acesso.'),
            CTextSimpleStyle(customMargin: EdgeInsets.symmetric(horizontal: 24)),
          ),
          const Spacer(),
          if (hasBothData)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              child: Semantics(
                identifier: 'buttonChange',
                child: GestureDetector(
                  onTap: () => setState(() => _recoveryByPhone = !_recoveryByPhone),
                  child: Text(
                    isWhatsappShowed ? 'Trocar para email' : 'Trocar para whatsapp',
                    style: text(link: true),
                  ),
                ),
              ),
            ),
          if (_recoverySent)
            const CText(
              CTextData('Se você não recebeu a mensagem ou não reconhece o número mencionado, entre em contato com o nosso suporte.'),
              CTextSimpleStyle(customMargin: EdgeInsets.symmetric(horizontal: 24, vertical: 12)),
            ),
        ],
      ),
      bottomBarBuilder: (_) => CBottomBarButton(
        CBottomBarButtonData(buttonData: CButtonData.label('ENVIAR', id: 'buttonSend')),
        const CBottomBarButtonDefaultStyle(),
        onTap: () async {
          setState(() => _recoverySent = true);
          await showCSnackBarMessage(
            CSnackBarMessageData(
              isWhatsappShowed ? 'Troca de senha enviada para o Whatsapp' : 'Troca de senha enviada para o email',
              id: 'snackBarMessage',
            ),
            const CSnackBarMessageSuccessStyle(),
          );
        },
      ),
    );
  }

  Widget library(BuildContext context) {
    final component = widget.component ?? Uri.base.queryParameters['component'] ?? 'CButton';
    final card = appointmentCard(0);
    final cardData = card.data;
    final cardStyle = card.style;

    if (component == 'foundation:cores') {
      return _foundationColors(context);
    }

    Widget sample() => switch (component) {
      'CAvatar' => Align(
        alignment: Alignment.topLeft,
        child: CAvatar(switch (_fixture.avatarRole) {
          'guardian' => CAvatarData(
            imageUrl: _fixture.settingsGuardianPhoto ? avatarPhoto('mother') : '',
            defaultAbbreviationName: _fixture.legalGuardianName,
          ),
          'professional' => cardData.professionalAvatarData,
          'supervisor' => cardData.supervisorAvatarData!,
          _ => cardData.patientAvatarData,
        }, cardStyle.avatarStyle(context)),
      ),
      'CDivider' => CDivider(cardStyle.dividerStyle(context)),
      'CChip' => Align(
        alignment: Alignment.topLeft,
        child: CChip(
          switch (_fixture.chipRole) {
            'time' => CChipData.iconAndLabel(cardData.timeIcon, _fixture.scheduleTime == 'none' ? '--:--' : _fixture.scheduleTime),
            'room' => CChipData.iconAndLabel(cardData.roomIcon, cardData.roomName.isEmpty ? 'Sem sala' : cardData.roomName),
            'unit' => CChipData.label(cardData.unitName),
            _ => CChipData.label(cardData.status.label),
          },
          _fixture.chipRole == 'status' ? cardStyle.statusChipStyle(context) : cardStyle.dataChipStyle(context),
        ),
      ),
      'CAvatarUpdater' => settings().first,
      'CAppBarRow' => backHeader('Configurações') as Widget,
      'CText' => const CText(CTextData('Configurações'), CTextParentDetailsStyle()),
      'CButtonBack' => Align(
        alignment: Alignment.topLeft,
        child: CButtonBack<void>(
          CButtonBackData(),
          const CButtonBackDefaultStyle(),
          onTap: () => message('Voltar para a tela anterior'),
        ),
      ),
      'CHeader' =>
        settings()[_fixture.settingsSection == 'permissions'
            ? 3
            : _fixture.settingsSection == 'information'
            ? 5
            : 1],
      'CCardList' =>
        settings()[_fixture.settingsSection == 'permissions'
            ? 4
            : _fixture.settingsSection == 'information'
            ? 6
            : 2],
      'FeedSection' => feedSection(),
      'AppointmentsSection' => appointmentsSection(),
      'CCardFeed' => feedCard(0),
      'CTileScheduleParent' => appointment(0),
      'CAppBarUser2' => CAppBarUser2(
        CAppBarUser2Data(
          greetings: 'Olá,',
          name: _fixture.legalGuardianName,
          avatarData: _avatar,
          buttonData: CButtonData.icon(UIconsExtension.menu),
        ),
        const CAppBarUser2DefaultStyle(),
        onUserTap: () => message('Avatar do cabeçalho'),
        onButtonTap: () => message('Menu do cabeçalho'),
      ),
      'CBottomBarUser' => bottom(),
      'CCalendarWeekly' => agendaHeader(),
      'CTextField' => CTextField(
        _fixture.fieldError
            ? CTextFieldData(
                hint: 'Buscar por paciente, sala...',
                errorMessage: 'Revise o termo informado.',
              )
            : CTextFieldData.search(hint: 'Buscar por paciente, sala...'),
        const CTextFieldDefaultStyle(),
        controller: _search,
      ),
      'CContainerListInformation' => _fixture.state == 'ready' ? empty(false) : statePreview(),
      'CTileParentContent' => _fixture.showContent ? contentTile() : const Text('Fixture sem conteúdo.'),
      'CTileSettings' => CCardList(
        const CCardListSettingsStyle(),
        children: [
          if (['notifications', 'camera', 'gallery'].contains(_fixture.settingsItem))
            CTileSettings.checkbox(
              CTileSettingsCheckboxData(
                label: {
                  'notifications': 'Notificações',
                  'camera': 'Câmera',
                  'gallery': 'Galeria',
                }[_fixture.settingsItem]!,
                description: _fixture.settingsPlatform == 'ios'
                    ? 'Configurações → Apps → Bloomy → ${_fixture.settingsItem == 'camera'
                          ? 'Câmera'
                          : _fixture.settingsItem == 'gallery'
                          ? 'Fotos'
                          : 'Notificações'}'
                    : '',
                icon: _fixture.settingsItem == 'camera'
                    ? UIcons.camera
                    : _fixture.settingsItem == 'gallery'
                    ? UIcons.gallery
                    : UIcons.notificationOn,
                isChecked: _permissions[0],
              ),
              const CTileSettingsSettingsStyle(isFirst: true, isLast: true),
              onChanged: (_) => setState(() => _permissions[0] = !_permissions[0]),
            )
          else
            CTileSettings(
              CTileSettingsData(
                label:
                    {
                      'password': 'Redefinir senha',
                      'terms': 'Termos de uso',
                      'consent': 'Termo de Ciência',
                      'about': 'Sobre',
                    }[_fixture.settingsItem] ??
                    'Sobre',
                icon: _fixture.settingsItem == 'password'
                    ? UIcons.changePassword
                    : _fixture.settingsItem == 'about'
                    ? UIcons.about
                    : UIcons.termsOfUse,
              ),
              const CTileSettingsSettingsStyle(isFirst: true, isLast: true),
              onTap: () => message('Navegação local de demonstração'),
            ),
        ],
      ),
      _ => CButton(
        CButtonData.label(_fixture.label, isEnabled: _fixture.isEnabled),
        const CButtonDefaultStyle(),
        onTap: () => message('CButton original'),
      ),
    };
    if (component == 'CScaffold') {
      return CScaffold(
        const CScaffoldData(isBodyUnderAppBar: false),
        const CScaffoldParentStyle(),
        appBarBuilder: (_) => backHeader('Configurações'),
        body: const SizedBox.expand(),
        bottomBarBuilder: (_) => bottom(),
      );
    }
    if (component == 'CBottomBarUser' || component == 'CAppBarUser2' || component == 'CAppBarRow') {
      return CScaffold(
        const CScaffoldData(isBodyUnderAppBar: false),
        const CScaffoldParentStyle(),
        appBarBuilder: (_) => component == 'CAppBarUser2' || component == 'CAppBarRow' ? sample() as IAppBar : const CAppBarEmpty(),
        body: const SizedBox.expand(),
        bottomBarBuilder: component == 'CBottomBarUser' ? (_) => bottom() : null,
      );
    }
    if (component.startsWith('foundation:')) {
      return _foundationColors(context);
    }
    return CScaffold.list(
      const CScaffoldListData(
        isBodyUnderAppBar: false,
        isBodyUnderBottomBar: false,
      ),
      const CScaffoldParentStyle(
        customListMainAxisAlignment: MainAxisAlignment.start,
      ),
      appBarBuilder: (_) => const CAppBarEmpty(),
      bodies: [
        Padding(
          padding:
              [
                'CCardFeed',
                'CTileScheduleParent',
                'FeedSection',
                'AppointmentsSection',
              ].contains(component)
              ? EdgeInsets.zero
              : const EdgeInsets.all(16),
          child: sample(),
        ),
      ],
    );
  }

  Widget _foundationColors(BuildContext context) {
    final bloomyColors = context.theme<BloomyColors>()!;
    final colorsData = [
      CardColorData('primary', colorGroup: bloomyColors.primary),
      CardColorData('secondary', colorGroup: bloomyColors.secondary),
      CardColorData('accent', colorGroup: bloomyColors.accent),
      CardColorData('success', colorGroup: bloomyColors.success),
      CardColorData('info', colorGroup: bloomyColors.info),
      CardColorData('warning', colorGroup: bloomyColors.warning),
      CardColorData('danger', colorGroup: bloomyColors.danger),
      CardColorData('shadow', colorGroup: bloomyColors.shadow),
      CardColorData('text', colorGroupText: bloomyColors.text),
      CardColorData('background', colorGroupBackground: bloomyColors.background),
      CardColorData('backgroundGradient', gradient: bloomyColors.backgroundGradient),
      CardColorData('splashBackground', color: bloomyColors.splashBackground),
      CardColorData('white20', colorGroup: bloomyColors.white20),
    ];
    final opBackgroundColor = switch (_fixture.id) {
      'bg-background-main' => bloomyColors.background.main,
      'bg-background-light' => bloomyColors.background.light,
      'bg-background-dark' => bloomyColors.background.dark,
      'bg-black' => Colors.black,
      'bg-white' => Colors.white,
      'bg-transparent' => Colors.transparent,
      _ => Colors.transparent,
    };

    return Container(
      color: const Color(0xFFEEF6F9),
      child: ListView(
        padding: const EdgeInsets.all(24),
        children: [
          LayoutBuilder(
            builder: (context, constraints) {
              final width = constraints.maxWidth;
              final columns = switch (width) {
                final w when w >= 1100 => 4,
                final w when w >= 780 => 3,
                final w when w >= 540 => 2,
                _ => 1,
              };

              return Wrap(
                spacing: 16,
                runSpacing: 16,
                children: colorsData.map((colorData) {
                  return CardColor(
                    colorData: colorData,
                    opBackgroundColor: opBackgroundColor,
                    width: (width - (columns - 1) * 16) / columns,
                  );
                }).toList(),
              );
            },
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    if (_page == 'agreements') {
      return AgreementsPreview(
        initialState: _fixture.agreementState,
        onComplete: () {
          go('home');
          message('Assinatura demonstrativa concluída. Nenhum documento foi enviado.');
        },
      );
    }
    if (_page == 'login') return login();
    if (_page == 'password-recovery') return passwordRecovery();
    if (_page == 'library') return library(context);
    if (_page == 'password') return changePassword();
    if (_page == 'settings') {
      return CScaffold.list(
        const CScaffoldListData(
          isBodyUnderAppBar: false,
          isBodyUnderBottomBar: false,
        ),
        const CScaffoldParentStyle(
          customListMainAxisAlignment: MainAxisAlignment.start,
          customListCrossAxisAlignment: CrossAxisAlignment.start,
        ),
        appBarBuilder: (_) => backHeader('Configurações'),
        bodies: settings(),
        bottomBarBuilder: (_) => bottom(),
      );
    }
    if ([
      'terms',
      'consent',
      'contracts',
      'about',
      'content',
      'password',
    ].contains(_page)) {
      return document();
    }
    return CScaffold(
      const CScaffoldData(isBodyUnderAppBar: false),
      const CScaffoldParentStyle(),
      appBarBuilder: (ctx) => ['feed', 'notifications'].contains(_page) ? backHeader(_labels[_page]!) : header(ctx),
      body: !['home', 'feed', 'agenda'].contains(_page) && _fixture.state != 'ready'
          ? statePreview()
          : switch (_page) {
              'agenda' => agenda(),
              'contents' => contents(),
              'metrics' => metrics(),
              'feed' => feed(),
              'notifications' => CListInfinite(
                const CListInfiniteData(
                  itemCount: 0,
                  hasReachedMax: true,
                ),
                const CListInfiniteProfessionalStyle(),
                onFetchData: () async {},
                itemBuilder: (_, _) => const SizedBox.shrink(),
              ),
              _ => home(),
            },
      drawer: drawer(),
      bottomBarBuilder: (_) => bottom(),
    );
  }
}

/// WhatsApp brand green. components_bloomy has no token for it.
const _whatsAppGreen = Color(0xFF25D366);

class _WhatsAppIconStyle extends CIconPasswordRecoveryStyle {
  const _WhatsAppIconStyle();

  @override
  Color? backgroundColor(BuildContext context) => _whatsAppGreen;
}
