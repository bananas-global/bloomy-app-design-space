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

    this.showFeed = false,
    this.showSchedules = false,
    this.state = 'ready',
    this.calendarMode = 'month',
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
  final bool settingsGuardianPhoto, settingsPatientPhoto;
  final String settingsProfileCount, settingsPlatform, settingsSection, settingsItem;
  final String avatarRole, chipRole;
  final String schedulePatientPhoto, scheduleTime, roomName, unitName;
  final bool supervisorInitials;
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
  String get resolvedFeedState => feedState != "inherit"
      ? feedState
      : state != "ready"
      ? state
      : showFeed
      ? "ready"
      : "empty";
  String get resolvedScheduleState => scheduleState != "inherit"
      ? scheduleState
      : state != "ready"
      ? state
      : showSchedules
      ? "ready"
      : "empty";
  int get postCount => (int.tryParse(feedCount) ?? 1).clamp(1, 3);
  int get appointmentCount => (int.tryParse(scheduleCount) ?? 2).clamp(1, 3);
  final String legalGuardianName, patientName, title, description, label;
  final bool showContent, isEnabled, showFeed, showSchedules;
  final String state,
      calendarMode,
      loginStep,
      permissions,
      searchText,
      navigation,
      contentType;
  final bool fieldError;
  factory PreviewFixture.fromJson(String? raw) {
    if (raw == null) return const PreviewFixture();
    try {
      final decoded = jsonDecode(raw) as Map<String, dynamic>;
      final data = decoded.containsKey('data') || decoded.containsKey('preview')
          ? <String, dynamic>{...decoded['preview'] as Map<String, dynamic>, ...decoded['data'] as Map<String, dynamic>}
          : Map<String, dynamic>.from(decoded);
      const legacyFields = {
        'guardian': 'legalGuardianName', 'patient': 'patientName',
        'contentTitle': 'title', 'contentDescription': 'description',
        'buttonLabel': 'label', 'buttonEnabled': 'isEnabled',
        'scheduleStatus': 'status', 'scheduleRoom': 'roomName', 'scheduleUnit': 'unitName',
      };
      for (final entry in legacyFields.entries) {
        if (!data.containsKey(entry.value) && data.containsKey(entry.key)) data[entry.value] = data[entry.key];
      }
      if (data['roomName'] == 'none') data['roomName'] = '';

      String field(String name, String fallback) {
        final v = data[name];
        return v is String && (v.trim().isNotEmpty || name == 'roomName') && v.length <= 300
            ? v
            : fallback;
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
        headerPhoto: data['headerPhoto'] is bool ? data['headerPhoto'] : false,
        feedState: field('feedState', 'inherit'),
        feedCount: field('feedCount', '1'),
        postAvatarPhoto: data['postAvatarPhoto'] is bool
            ? data['postAvatarPhoto']
            : false,
        postText: field('postText', 'medium'),
        postMedia: field('postMedia', 'image'),
        scheduleState: field('scheduleState', 'inherit'),
        scheduleCount: field('scheduleCount', '2'),
        status: field('status', 'scheduled'),
        hasProfessional: data['hasProfessional'] is bool
            ? data['hasProfessional']
            : true,
        hasSupervisor: data['hasSupervisor'] is bool
            ? data['hasSupervisor']
            : false,
        professionalPhoto: data['professionalPhoto'] is bool
            ? data['professionalPhoto']
            : false,

        showFeed: data['showFeed'] == true,
        showSchedules: data['showSchedules'] == true,
        state: field('state', 'ready'),
        calendarMode: field('calendarMode', 'month'),
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
        showContent: data['showContent'] is bool ? data['showContent'] : true,
        isEnabled: data['isEnabled'] is bool
            ? data['isEnabled']
            : true,
      );
    } catch (_) {
      return const PreviewFixture();
    }
  }
}
