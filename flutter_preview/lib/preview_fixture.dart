import 'dart:convert';

/// Synthetic, bounded data accepted by the local design environment.
class PreviewFixture {
  const PreviewFixture({
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
