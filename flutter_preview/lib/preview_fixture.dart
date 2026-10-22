import 'dart:convert';

/// Synthetic, bounded data accepted by the local design environment.
class PreviewFixture {
  const PreviewFixture({
    this.settingsGuardianPhoto = true,
    this.settingsPatientPhoto = true,
    this.settingsProfileCount = '2',
    this.settingsPlatform = 'ios',
    this.settingsSection = 'security',
    this.settingsItem = 'password',
    this.avatarRole = 'patient',
    this.chipRole = 'status',
    this.schedulePatientPhoto = 'inherit',
    this.supervisorInitials = true,
    this.scheduleTime = '14:00',
    this.roomName = 'Sala 1',
    this.unitName = 'Unidade Jardim',
    this.headerPhoto = false,
    this.feedState = 'inherit',
    this.feedCount = '1',
    this.postAvatarPhoto = false,
    this.postText = 'medium',
    this.postMedia = 'image',
    this.scheduleState = 'inherit',
    this.scheduleCount = '2',
    this.status = 'scheduled',
    this.hasProfessional = true,
    this.hasSupervisor = false,
    this.professionalPhoto = false,
    this.showFullStartDate = false,

    this.showFeed = false,
    this.showSchedules = false,
    this.state = 'ready',
    this.calendarMode = 'month',
    this.agreementState = 'pending',
    this.recoveryContacts = 'phone',
    this.recoverySent = false,
    this.loginStep = 'cpf',
    this.permissions = 'reference',
    this.searchText = '',
    this.fieldError = false,
    this.navigation = 'home',
    this.contentType = 'video',
    this.legalGuardianName = 'Teste',
    this.patientName = 'Teste Maria',
    this.title = 'Teste v1',
    this.description = 'Teste vídeo de coelho.',
    this.showContent = true,
    this.label = 'PRÓXIMO',
    this.isEnabled = true,
  });

  factory PreviewFixture.fromJson(String? raw) {
    if (raw == null) return const PreviewFixture();
    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      final data = decoded.containsKey('data') || decoded.containsKey('preview')
          ? <String, dynamic>{...decoded['preview'] as Map<String, dynamic>, ...decoded['data'] as Map<String, dynamic>}
          : Map<String, dynamic>.from(decoded);
      const legacyFields = {
        'guardian': 'legalGuardianName',
        'patient': 'patientName',
        'contentTitle': 'title',
        'contentDescription': 'description',
        'buttonLabel': 'label',
        'buttonEnabled': 'isEnabled',
        'scheduleStatus': 'status',
        'scheduleRoom': 'roomName',
        'scheduleUnit': 'unitName',
      };
      for (final entry in legacyFields.entries) {
        if (!data.containsKey(entry.value) && data.containsKey(entry.key)) data[entry.value] = data[entry.key];
      }
      if (data['roomName'] == 'none') data['roomName'] = '';

      String field(String name, String fallback) {
        final v = data[name];
        return v is String && (v.trim().isNotEmpty || name == 'roomName') && v.length <= 300 ? v : fallback;
      }

      return PreviewFixture(
        settingsGuardianPhoto: data['settingsGuardianPhoto'] != false,
        settingsPatientPhoto: data['settingsPatientPhoto'] != false,
        settingsProfileCount: field('settingsProfileCount', '2'),
        settingsPlatform: field('settingsPlatform', 'ios'),
        settingsSection: field('settingsSection', 'security'),
        settingsItem: field('settingsItem', 'password'),
        avatarRole: field('avatarRole', 'patient'),
        chipRole: field('chipRole', 'status'),
        schedulePatientPhoto: field('schedulePatientPhoto', 'inherit'),
        supervisorInitials: data['supervisorInitials'] != false,
        scheduleTime: field('scheduleTime', '14:00'),
        roomName: field('roomName', 'Sala 1'),
        unitName: field('unitName', 'Unidade Jardim'),
        headerPhoto: data['headerPhoto'] is bool && data['headerPhoto'] as bool,
        feedState: field('feedState', 'inherit'),
        feedCount: field('feedCount', '1'),
        postAvatarPhoto: data['postAvatarPhoto'] is bool && data['postAvatarPhoto'] as bool,
        postText: field('postText', 'medium'),
        postMedia: field('postMedia', 'image'),
        scheduleState: field('scheduleState', 'inherit'),
        scheduleCount: field('scheduleCount', '2'),
        status: field('status', 'scheduled'),
        hasProfessional: data['hasProfessional'] is! bool || data['hasProfessional'] as bool,
        hasSupervisor: data['hasSupervisor'] is bool && data['hasSupervisor'] as bool,
        professionalPhoto: data['professionalPhoto'] is bool && data['professionalPhoto'] as bool,
        showFullStartDate: data['showFullStartDate'] == true,

        showFeed: data['showFeed'] == true,
        showSchedules: data['showSchedules'] == true,
        state: field('state', 'ready'),
        calendarMode: field('calendarMode', 'month'),
        agreementState: field('agreementState', 'pending'),
        recoveryContacts: field('recoveryContacts', 'phone'),
        recoverySent: data['recoverySent'] == true,
        loginStep: field('loginStep', 'cpf'),
        permissions: field('permissions', 'reference'),
        searchText: field('searchText', ''),
        fieldError: data['fieldError'] == true,
        navigation: field('navigation', 'home'),
        contentType: field('contentType', 'video'),
        legalGuardianName: field('legalGuardianName', 'Teste'),
        patientName: field('patientName', 'Teste Maria'),
        title: field('title', 'Teste v1'),
        description: field(
          'description',
          'Teste vídeo de coelho.',
        ),
        label: field('label', 'PRÓXIMO'),
        showContent: data['showContent'] is! bool || data['showContent'] as bool,
        isEnabled: data['isEnabled'] is! bool || data['isEnabled'] as bool,
      );
    } catch (_) {
      return const PreviewFixture();
    }
  }

  final bool settingsGuardianPhoto;
  final bool settingsPatientPhoto;
  final String settingsProfileCount;
  final String settingsPlatform;
  final String settingsSection;
  final String settingsItem;
  final String avatarRole;
  final String chipRole;
  final String schedulePatientPhoto;
  final bool supervisorInitials;
  final String scheduleTime;
  final String roomName;
  final String unitName;
  final bool headerPhoto;
  final String feedState;
  final String feedCount;
  final bool postAvatarPhoto;
  final String postText;
  final String postMedia;
  final String scheduleState;
  final String scheduleCount;
  final String status;
  final bool hasProfessional;
  final bool hasSupervisor;
  final bool professionalPhoto;
  final bool showFullStartDate;

  final bool showFeed;
  final bool showSchedules;
  final String state;
  final String calendarMode;
  final String agreementState;

  /// Contacts registered for the password link: `phone`, `email` or `both`.
  final String recoveryContacts;

  /// Whether ENVIAR was already tapped (`isFirstSend` is false in the app).
  final bool recoverySent;

  final String loginStep;
  final String permissions;
  final String searchText;
  final bool fieldError;
  final String navigation;
  final String contentType;

  final String legalGuardianName;
  final String patientName;
  final String title;
  final String description;
  final bool showContent;
  final String label;
  final bool isEnabled;

  String get resolvedFeedState => feedState != 'inherit'
      ? feedState
      : state != 'ready'
      ? state
      : showFeed
      ? 'ready'
      : 'empty';

  String get resolvedScheduleState => scheduleState != 'inherit'
      ? scheduleState
      : state != 'ready'
      ? state
      : showSchedules
      ? 'ready'
      : 'empty';

  int get postCount => (int.tryParse(feedCount) ?? 1).clamp(1, 3);
  int get appointmentCount => (int.tryParse(scheduleCount) ?? 2).clamp(1, 3);
}
