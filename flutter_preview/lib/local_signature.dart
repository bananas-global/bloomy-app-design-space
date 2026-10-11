import 'package:components_bloomy/components_bloomy.dart';
import 'package:flutter_extension/flutter_extension.dart';

Future<bool?> showLocalSignatureBottomSheet(BuildContext context) async {
  return showBottomSheetScreen<bool>(
    const BottomSheetScreenData(isLimitedHeightByRatio: true),
    const BottomSheetScreenDefaultStyle(
      customScrollControlDisabledMaxHeightRatio: 0.98,
    ),
    builder: (_) => const _SignatureBottomSheet(),
  );
}

class _SignatureBottomSheet extends StatefulWidget {
  const _SignatureBottomSheet();
  final String title = 'Assinatura digital';
  final String description =
      'Esta assinatura será utilizada para todos documentos aceitados previamente.';
  final String buttonLabel = 'ASSINAR';
  @override
  State<_SignatureBottomSheet> createState() => _SignatureBottomSheetState();
}

class _SignatureBottomSheetState extends State<_SignatureBottomSheet> {
  final controller = SignatureController(
    penStrokeWidth: 4,
    penColor: const Color(0xFF2B235B),
    exportBackgroundColor: Colors.white,
  );
  @override
  void dispose() {
    controller.dispose();
    super.dispose();
  }

  final _signatureKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    return RotatedBox(
      quarterTurns: 3,
      child: CBottomSheetInternalScreen.list(
        CBottomSheetInternalScreenData(
          appBarTitleData: CAppBarTitleBottomSheetData(title: widget.title),
          addFlexible: true,
          isScrollable: false,
          fixSpaceInIOS: false,
        ),
        // TODO mudar o o padding pro default
        const CBottomSheetInternalScreenDefaultStyle(
          customPadding: EdgeInsets.all(20),
        ),
        onCloseTap: () => Navigator.of(context).pop(false),
        bodies: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Text(
              'Utilize o espaço abaixo para desenhar ou digitar sua assinatura.',
              // TODO mudar o estilo
              style: TextStyle(
                color: context.theme<BloomyColors>()?.text.op80,
                fontSize: 14,
                fontFamily: 'Roboto',
                fontWeight: FontWeight.w700,
                height: 1.30,
              ),
            ),
          ),
          Expanded(
            child: DecoratedBox(
              decoration: ShapeDecoration(
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(8),
                ),
              ),
              child: CSignature(
                const CSignatureDefaultStyle(),
                controller: controller,
                key: _signatureKey,
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
            child: Text(
              widget.description,
              // TODO mudar o estilo
              style: TextStyle(
                color: context.theme<BloomyColors>()?.text.op60,
                fontSize: 13,
                fontFamily: 'Roboto',
                fontWeight: FontWeight.w400,
                height: 1.60,
              ),
            ),
          ),
        ],
        bottomBar: ListenableBuilder(
          listenable: controller,
          builder: (_, _) => CBottomBarButtons.horizontal(
            CBottomBarButtonsHorizontalData(
              leftButtonData: const CButton2LabelData('REFAZER'),
              rightButtonData: CButton2LabelData(
                widget.buttonLabel,
                isEnabled: controller.isNotEmpty,
              ),
            ),
            const CBottomBarButtonsBottomSheetStyle(),
            onLeftButtonTap: () async => controller.clear(),
            onRightButtonTap: () async {
              // final size = (_signatureKey.currentContext!.findRenderObject()! as RenderBox).size;
              Navigator.of(context).pop(true);
            },
          ),
        ),
      ),
    );
  }
}
