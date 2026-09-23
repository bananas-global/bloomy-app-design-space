import 'package:components_bloomy/components_bloomy.dart';
import 'package:flutter_extension/flutter_extension.dart' hide context;
import 'package:flutter_svg/flutter_svg.dart';
import 'app_icons.dart';
import 'preview_bridge.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SemanticsBinding.instance.ensureSemantics();
  runApp(const PreviewApp());
}

class PreviewApp extends StatefulWidget {
  const PreviewApp({super.key, this.initialScreen});
  final String? initialScreen;
  @override
  State<PreviewApp> createState() => _PreviewAppState();
}

class _PreviewAppState extends State<PreviewApp> {
  final controller = DesignSystemController(
    themeModeSelected: ThemeMode.light,
    supportedThemeDatas: [const BloomyThemeData()],
    localeSelected: const Locale('pt', 'BR'),
    supportedLocales: const [Locale('pt', 'BR')],
    localizationFilesPath: 'assets/translations',
  );
  @override
  Widget build(BuildContext context) => DesignSystemBuilder(
    controller: controller,
    builder: (context, mode, light, dark, locale, delegates, locales) =>
        MaterialApp(
          debugShowCheckedModeBanner: false,
          theme: light,
          darkTheme: dark,
          themeMode: ThemeMode.light,
          locale: locale,
          localizationsDelegates: delegates,
          supportedLocales: locales,
          home: Preview(initialScreen: widget.initialScreen),
          builder: (context, child) => MediaQuery(
            data: MediaQuery.of(context).copyWith(
              padding: const EdgeInsets.only(top: 62, bottom: 34),
              viewPadding: const EdgeInsets.only(top: 62, bottom: 34),
              textScaler: const TextScaler.linear(1.1),
            ),
            child: child!,
          ),
        ),
  );
}

class Preview extends StatefulWidget {
  const Preview({super.key, this.initialScreen});
  final String? initialScreen;
  @override
  State<Preview> createState() => _PreviewState();
}

class _PreviewState extends State<Preview> {
  late String page =
      widget.initialScreen ?? Uri.base.queryParameters['screen'] ?? 'home';
  final calendar = CalendarWeeklyController();
  final search = TextEditingController();
  final cpf = TextEditingController();
  final password = TextEditingController();
  DateTime day = DateTime(2026, 9, 23);
  bool passwordStep = false, keep = true;
  final permissions = [true, false, false];
  String patient = 'Teste Maria';
  CAvatarData get avatar => const CAvatarData(
    imageUrl: "",
    defaultAbbreviationName: 'TS',
  );
  void go(String next) {
    setState(() {
      page = next;
      search.clear();
    });
    notifyScreen(next);
  }

  @override
  void dispose() {
    calendar.dispose();
    search.dispose();
    cpf.dispose();
    password.dispose();
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
  final labels = {
    'home': 'Início',
    'contents': 'Conteúdos',
    'metrics': 'Evolutivo',
    'agenda': 'Agenda',
    'contracts': 'Contratos',
    'feed': 'Feed',
    'notifications': 'Notificações',
    'settings': 'Configurações',
  };
  Icone icon(String id, bool selected) => switch (id) {
    'home' =>
      selected ? UIconsExtension.selectHome : UIconsExtension.unselectHome,
    'contents' =>
      selected
          ? UIconsExtension.selectTrainings
          : UIconsExtension.unselectTrainings,
    'metrics' =>
      selected
          ? UIconsExtension.selectGraphics
          : UIconsExtension.unselectGraphics,
    'agenda' =>
      selected
          ? UIconsExtension.selectSchedules
          : UIconsExtension.unselectSchedules,
    'contracts' =>
      selected
          ? UIconsExtension.selectContracts
          : UIconsExtension.unselectContracts,
    'feed' =>
      selected ? UIconsExtension.selectFeeds : UIconsExtension.unselectFeeds,
    'notifications' =>
      selected
          ? UIconsExtension.selectNotifications
          : UIconsExtension.unselectNotifications,
    _ =>
      selected
          ? UIconsExtension.selectSettings
          : UIconsExtension.unselectSettings,
  };
  CBottomBarUser bottom() => CBottomBarUser(
    CBottomBarUserData(
      itemsData: [
        for (final id in ['home', 'contents', 'metrics', 'agenda'])
          CBottomBarUserItemData(
            selectIcon: icon(id, true),
            unselectIcon: icon(id, false),
            label: labels[id]!,
            itemPath: id,
          ),
        if (page == 'settings' || page == 'metrics')
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
      currentPath: page,
    ),
    const CBottomBarUserDefaultStyle(),
    onUserTap: selectPatient,
    onItemTap: (id) => go(id as String),
  );
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
          for (final name in ['Todos', 'Teste Maria', 'Teste João'])
            ListTile(
              title: Text(name),
              trailing: patient == name ? const Icon(Icons.check) : null,
              onTap: () {
                setState(() => patient = name);
                Navigator.pop(c);
              },
            ),
        ],
      ),
    ),
  );
  Widget drawer() => CDrawer(
    CDrawerData(
      name: Name('Teste Responsável'),
      email: Email('responsavel@example.invalid'),
      avatarData: avatar,
      itemsData: [
        for (final id in labels.keys)
          CDrawerItemData(
            selectIcon: icon(id, true),
            unselectIcon: icon(id, false),
            label: labels[id]!,
            itemPath: id,
          ),
      ],
      quitItemData: CDrawerItemData.button(icon: UIcons.quit, label: 'Sair'),
      currentPath: page,
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
      name: 'Teste',
      avatarData: avatar,
      buttonData: CButtonData.icon(UIconsExtension.menu),
    ),
    const CAppBarUser2DefaultStyle(),
    onUserTap: () => go('settings'),
    onButtonTap: () => Scaffold.of(ctx).openDrawer(),
    bottom: page == 'agenda'
        ? agendaHeader()
        : page == 'contents'
        ? CTextField(
            CTextFieldData.search(hint: 'Buscar por nome, área, protocolo...'),
            const CTextFieldDefaultStyle(
              customMargin: EdgeInsets.symmetric(horizontal: 16),
            ),
            controller: search,
            onChanged: (_) => setState(() {}),
          )
        : page == 'metrics'
        ? Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: CDropdown<String>(
              CDropdownData<String>(
                items: const [
                  CDropdownItemData(label: 'Teste Maria', value: 'Teste Maria'),
                  CDropdownItemData(label: 'Teste João', value: 'Teste João'),
                ],
                valueSelected: patient == 'Todos' ? 'Teste Maria' : patient,
              ),
              const CDropdownDefaultStyle(),
              onSelect: (v) => setState(() => patient = v),
            ),
          )
        : null,
  );
  Widget empty(bool feed) => CContainerListInformation(
    CContainerListInformationData(
      icon: feed ? UIconsExtension.contentEmpty : UIconsExtension.calendarEmpty,
      description: feed
          ? 'Não há feed disponíveis.'
          : 'Não há atendimentos agendados.',
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
                controller: search,
                onChanged: (_) => setState(() {}),
              ),
            ),
            ListenableBuilder(
              listenable: calendar,
              builder: (_, __) => CButton(
                CButtonData.icon(
                  calendar.format == CalendarFormat.monthly
                      ? UIcons.formatMonth
                      : UIcons.formatWeek,
                ),
                const CButtonBackStyle(),
                onTap: () {
                  calendar.format == CalendarFormat.monthly
                      ? calendar.changeToWeekly()
                      : calendar.changeToMonthly();
                },
              ),
            ),
          ],
        ),
        const SizedBox(height: 16),
        CCalendarWeekly(
          CCalendarWeeklyData(
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
          controller: calendar,
          onDaySelected: (selected, _, __, ___) =>
              setState(() => day = selected!),
        ),
      ],
    ),
  );
  Widget home() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      CHeader.content(
        const CHeaderContentData(
          'FEED',
          buttonData: CButton2LabelData('Acesse o feed completo'),
        ),
        const CHeaderDefaultStyle(isTop: true),
        onTap: () => go('feed'),
      ),
      empty(true),
      CHeader.content(
        const CHeaderContentData(
          'PRÓXIMOS ATENDIMENTOS',
          buttonData: CButton2LabelData('Ver Tudo'),
        ),
        const CHeaderDefaultStyle(),
        onTap: () => go('agenda'),
      ),
      empty(false),
    ],
  );
  Widget agenda() => Column(
    crossAxisAlignment: CrossAxisAlignment.stretch,
    children: [
      const SizedBox(height: 16),
      CHeader.content(
        CHeaderContentData(day.toStringFormatted('dd "de" Month, yyyy')),
        const CHeaderDateTimeStyle(isHoliday: false),
      ),
      const SizedBox(height: 16),
      empty(false),
    ],
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
        if (search.text.isEmpty ||
            'teste v1 teste vídeo de coelho'.contains(
              search.text.toLowerCase(),
            ))
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
      patientName: patient == 'Todos' ? 'Teste Maria' : patient,
      updatedAt: DateTime(2025, 10, 1, 17, 21),
      patientAvatarData: const CAvatarData(
        imageUrl: "",
        defaultAbbreviationName: 'TM',
        defaultPriority: DefaultPriority.abbreviation,
      ),
      title: 'Teste v1',
      description: 'Teste vídeo de coelho.',
      contentType: ContentType.video,
      id: 'synthetic-content-1',
    ),
    const CTileParentContentDefaultStyle(),
    chips: [
      const CChip(CChipData.label('ABLLS-R'), CChipProtocolStyle()),
      const CChip(
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
        CMetricCurrentArea(
          CMetricCurrentAreaData(areas: const []),
          const CMetricCurrentAreaDefaultStyle(),
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
            title: 'Teste Responsável',
            avatarUrl: Url(''),
          ),
          AvatarUserData(
            id: 'patient',
            title: 'Teste Maria',
            avatarUrl: Url(''),
          ),
        ],
      ),
      const CAvatarUpdaterDefaultStyle(),
      onAvatarTap: (_) =>
          message('Troca de foto simulada. Nenhuma imagem será enviada.'),
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
              description:
                  'Configurações → Apps → Bloomy → ${i == 2 ? 'Fotos' : label}',
              icon: [UIcons.notificationOn, UIcons.camera, UIcons.gallery][i],
              isChecked: permissions[i],
            ),
            CTileSettingsSettingsStyle(
              customIconColor: const Color(0xFF4094BB),
              isFirst: i == 0,
              isLast: i == 2,
            ),
            onChanged: (_) => setState(() => permissions[i] = !permissions[i]),
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
  @override
  Widget build(BuildContext context) {
    if (page == 'login') return login();
    if (page == 'library') return library();
    if (page == 'password') return changePassword();
    if (page == 'settings')
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
    if ([
      'terms',
      'consent',
      'contracts',
      'about',
      'content',
      'password',
    ].contains(page))
      return document();
    return CScaffold(
      const CScaffoldData(isBodyUnderAppBar: false),
      const CScaffoldParentStyle(),
      appBarBuilder: (ctx) => ['feed', 'notifications'].contains(page)
          ? backHeader(labels[page]!)
          : header(ctx),
      body: switch (page) {
        'agenda' => agenda(),
        'contents' => contents(),
        'metrics' => metrics(),
        'feed' => empty(true),
        'notifications' => CListInfinite(
          CListInfiniteData(
            itemCount: 0,
            isLoading: false,
            hasError: false,
            hasReachedMax: true,
          ),
          const CListInfiniteProfessionalStyle(),
          onFetchData: () async {},
          itemBuilder: (_, __) => const SizedBox.shrink(),
        ),
        _ => home(),
      },
      drawer: drawer(),
      bottomBarBuilder: (_) => bottom(),
    );
  }

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
        'content': 'Teste v1',
        'password': 'Redefinir senha',
      }[page]!,
    ),
    bodies: [
      Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            if (page == 'content') contentTile(),
            CText(
              CTextData(
                page == 'about'
                    ? 'Bloomy\nABA Therapy\nVersão de referência: 1.10.3+89'
                    : page == 'password'
                    ? 'Redefinição de senha simulada neste ambiente.'
                    : page == 'content'
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
    appBarBuilder: (_) => passwordStep
        ? CAppBarRow(
            const CAppBarRowData(showDivider: false),
            const CAppBarRowParentBackStyle(),
            leftContent: CButtonBack<void>(
              CButtonBackData(),
              const CButtonBackDefaultStyle(),
              onTap: () => setState(() => passwordStep = false),
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
                  passwordStep
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
                  key: ValueKey(passwordStep),
                  controller: passwordStep ? password : cpf,
                  onChanged: (_) => setState(() {}),
                ),
              ),
              const SizedBox(height: 24),
              if (!passwordStep)
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
                            state: keep
                                ? SelectState.selected
                                : SelectState.unselected,
                          ),
                          const CCheckboxLoginStyle(),
                          onChanged: (_, __) => setState(() => keep = !keep),
                        ),
                      ),
                      CButton(
                        CButtonData.label('Esqueci minha senha'),
                        const CButtonForgotPasswordStyle(),
                        onTap: () => message(
                          'Recuperação simulada. Nenhum e-mail será enviado.',
                        ),
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
          passwordStep ? 'ENTRAR' : 'PRÓXIMO',
          isEnabled: passwordStep
              ? password.text.isNotEmpty
              : cpf.text.isNotEmpty,
        ),
        showDivider: false,
      ),
      const CBottomBarButtonLoginStyle(hasBlock: false),
      onTap: () {
        if (passwordStep) {
          go('home');
        } else {
          setState(() => passwordStep = true);
        }
      },
    ),
  );
  Widget library() => CScaffold.list(
    const CScaffoldListData(
      isBodyUnderAppBar: false,
      isBodyUnderBottomBar: false,
    ),
    const CScaffoldParentStyle(
      customListMainAxisAlignment: MainAxisAlignment.start,
    ),
    appBarBuilder: (_) => backHeader('Componentes originais'),
    bodies: [
      const CHeader.content(
        CHeaderContentData('BOTÕES · CButton'),
        CHeaderParentHomeStyle(),
      ),
      Padding(
        padding: const EdgeInsets.all(16),
        child: CButton(
          CButtonData.label('PRÓXIMO'),
          const CButtonDefaultStyle(),
          onTap: () => message('CButton original'),
        ),
      ),
      const CHeader.content(
        CHeaderContentData('BUSCA · CTextField'),
        CHeaderParentHomeStyle(),
      ),
      Padding(
        padding: const EdgeInsets.all(16),
        child: CTextField(
          CTextFieldData.search(hint: 'Buscar por paciente, sala...'),
          const CTextFieldDefaultStyle(),
        ),
      ),
      const CHeader.content(
        CHeaderContentData('VAZIO · CContainerListInformation'),
        CHeaderParentHomeStyle(),
      ),
      empty(false),
      const CHeader.content(
        CHeaderContentData('CONTEÚDO · CTileParentContent'),
        CHeaderParentHomeStyle(),
      ),
      Padding(padding: const EdgeInsets.all(16), child: contentTile()),
    ],
    bottomBarBuilder: (_) => bottom(),
  );
}
