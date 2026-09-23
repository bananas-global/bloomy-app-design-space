import 'dart:convert';

/// Synthetic, bounded data accepted by the local design environment.
class PreviewFixture {
  const PreviewFixture({
    this.state = 'ready',
    this.calendarMode = 'month',
    this.loginStep = 'cpf',
    this.permissions = 'reference',
    this.searchText = '',
    this.fieldError = false,
    this.navigation = 'home',
    this.contentType = 'video',
    this.guardian = 'Teste',
    this.patient = 'Teste Maria',
    this.contentTitle = 'Teste v1',
    this.contentDescription = 'Teste vídeo de coelho.',
    this.showContent = true,
    this.buttonLabel = 'PRÓXIMO',
    this.buttonEnabled = true,
  });
  final String guardian, patient, contentTitle, contentDescription, buttonLabel;
  final bool showContent, buttonEnabled;
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
      final data = jsonDecode(raw) as Map<String, dynamic>;
      String field(String name, String fallback) {
        final v = data[name];
        return v is String && v.trim().isNotEmpty && v.length <= 300
            ? v
            : fallback;
      }

      return PreviewFixture(
        state: field('state', 'ready'),
        calendarMode: field('calendarMode', 'month'),
        loginStep: field('loginStep', 'cpf'),
        permissions: field('permissions', 'reference'),
        searchText: field('searchText', ''),
        fieldError: data['fieldError'] == true,
        navigation: field('navigation', 'home'),
        contentType: field('contentType', 'video'),
        guardian: field('guardian', 'Teste'),
        patient: field('patient', 'Teste Maria'),
        contentTitle: field('contentTitle', 'Teste v1'),
        contentDescription: field(
          'contentDescription',
          'Teste vídeo de coelho.',
        ),
        buttonLabel: field('buttonLabel', 'PRÓXIMO'),
        showContent: data['showContent'] is bool ? data['showContent'] : true,
        buttonEnabled: data['buttonEnabled'] is bool
            ? data['buttonEnabled']
            : true,
      );
    } catch (_) {
      return const PreviewFixture();
    }
  }
}
