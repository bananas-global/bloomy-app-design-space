import 'package:components_bloomy/components_bloomy.dart';
import 'package:flutter_extension/flutter_extension.dart';
import 'local_signature.dart';
import 'app_icons.dart';

/// Local adaptation of app 1.11.3+94. Never persists legal acceptance or ink.
class AgreementsPreview extends StatefulWidget {
  const AgreementsPreview({
    super.key,
    required this.initialState,
    required this.onComplete,
  });
  final String initialState;
  final VoidCallback onComplete;
  @override
  State<AgreementsPreview> createState() => _AgreementsPreviewState();
}

class _AgreementsPreviewState extends State<AgreementsPreview> {
  final accepted = <int>{};
  int? selected;
  static final documents = [
    AgreementEntity(
      id: 'demo-terms',
      versionId: 'demo-v1',
      version: '1.0 (amostra)',
      effectiveFrom: DateTime(2026, 9, 23),
      contentHash: '',
      kind: AgreementKind.term,
      title: 'Termos de uso do aplicativo',
      description: 'Documento demonstrativo para revisão da interface.',
    ),
    AgreementEntity(
      id: 'demo-contract',
      versionId: 'demo-v1',
      version: '1.0 (amostra)',
      effectiveFrom: DateTime(2026, 9, 23),
      contentHash: '',
      title: 'Contrato de prestação de serviços',
      description: 'Contrato fictício, sem validade jurídica.',
    ),
  ];
  @override
  void initState() {
    super.initState();
    reset();
  }

  void reset() {
    accepted.clear();
    if (widget.initialState != 'pending') accepted.add(0);
    if (widget.initialState == 'accepted') accepted.add(1);
    selected = null;
  }

  @override
  void didUpdateWidget(covariant AgreementsPreview oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.initialState != widget.initialState) reset();
  }

  @override
  Widget build(BuildContext context) {
    final index = selected;
    if (index != null) {
      final document = documents[index];
      return CScaffold.list(
        const CScaffoldListData(isBodyUnderAppBar: false),
        const CScaffoldParentStyle(),
        appBarBuilder: (_) => CAppBarRow(
          const CAppBarRowData(showDivider: false),
          const CAppBarRowParentBackStyle(),
          leftContent: CButtonBack<void>(
            CButtonBackData(),
            const CButtonBackDefaultStyle(),
            onTap: () => setState(() => selected = null),
          ),
          centerContent: CText(
            CTextData(index == 0 ? 'Termo' : 'Contrato'),
            const CTextParentDetailsStyle(),
          ),
        ),
        bodies: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            child: Text(
              '${document.title}\n\nAMOSTRA DO DESIGN SPACE — SEM VALIDADE JURÍDICA\n\nEste texto sintético permite revisar a leitura e o aceite dos documentos. O conteúdo legal do app é recebido pelo backend e não foi copiado para esta prévia.\n\nAo tocar em ACEITAR, apenas o estado local desta demonstração será alterado. Nenhuma informação será enviada ou armazenada como aceite real.',
              style: TextStyle(
                color: context.theme<BloomyColors>()?.text.main,
                fontSize: 15,
                fontFamily: TFontFamily.nunitoSans,
                height: 1.30,
              ),
            ),
          ),
          const SizedBox(height: 130),
        ],
        bottomBarBuilder: (_) => CBottomBarButtons.only(
          const CBottomBarButtonsOnlyData(
            buttonData: CButton2LabelData('ACEITAR'),
          ),
          const CBottomBarButtonsAgreementsStyle(),
          onButtonTap: () => setState(() {
            accepted.add(index);
            selected = null;
          }),
        ),
      );
    }
    return CScaffold.list(
      const CScaffoldListData(isBodyUnderAppBar: false),
      const CScaffoldParentStyle(),
      appBarBuilder: (_) => CAppBarTitle(
        CAppBarTitleData(title: 'Aceite dos termos e contratos legais'),
        const CAppBarTitleStyle(),
      ),
      bodies: [
        const SizedBox(height: 16),
        const CText(
          CTextData(
            'Para acessar o App, é necessário aceitar os documentos abaixo, que regem o uso do aplicativo e os serviços da Bloomy:',
          ),
          CTextDescriptionStyle(
            customMargin: EdgeInsets.symmetric(horizontal: 20),
          ),
        ),
        const SizedBox(height: 12),
        Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          spacing: 12,
          children: [
            for (var i = 0; i < documents.length; i++)
              CTileAgreement(
                CTileAgreementData(
                  agreement: documents[i],
                  isAccepted: accepted.contains(i),
                  showAgreeementButtonData: CButton2IconData(
                    UIconsExtension.document,
                  ),
                ),
                const CTileAgreementDefaultStyle(
                  customMargin: EdgeInsets.symmetric(horizontal: 20),
                ),
                onShowAgreeementButtonTap: () => setState(() => selected = i),
              ),
          ],
        ),
        const SizedBox(height: 230),
      ],
      bottomBarBuilder: (_) => CBottomBarButtons.only(
        CBottomBarButtonsOnlyData(
          description: const CTextRichData([
            'Lendo todos documentos, está declarando que ',
            'leu, compreendeu e concordou',
            ' com os documentos acima.',
          ]),
          buttonData: CButton2LabelData(
            'ASSINAR DOCUMENTOS',
            isEnabled: accepted.length == documents.length,
          ),
        ),
        const CBottomBarButtonsAgreementsStyle(),
        onButtonTap: () async {
          final signed = await showLocalSignatureBottomSheet(context);
          if (signed == true && mounted) widget.onComplete();
        },
      ),
    );
  }
}
