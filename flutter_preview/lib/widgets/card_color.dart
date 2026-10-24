import 'package:components_bloomy/components_bloomy.dart';
import 'package:flutter_extension/flutter_extension.dart';

class CardColor extends StatelessWidget {
  const CardColor({required this.colorData, required this.opBackgroundColor, required this.width, super.key});

  final CardColorData colorData;
  final Color opBackgroundColor;
  final double width;

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: width,
      child: Container(
        padding: const EdgeInsets.fromLTRB(16, 14, 16, 16),
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF2B235B).withValues(alpha: 0.08)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            SelectableText(
              colorData.name.toUpperCase(),
              style: const TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.28,
                color: Color(0xB32B235B),
              ),
            ),
            if (colorData.gradient != null) ...[
              const SizedBox(height: 12),
              Container(
                height: 44,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(8),
                  gradient: colorData.gradient,
                  border: Border.all(color: const Color(0x1F2B235B)),
                ),
              ),
            ],
            if (colorData.color != null) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _baseChip('color', colorData.color!),
                ],
              ),
            ],
            if (colorData.colorGroup != null) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _baseChip('main', colorData.colorGroup!.main),
                  _baseChip('light', colorData.colorGroup!.light),
                  _baseChip('dark', colorData.colorGroup!.dark),
                  _baseChip('contrast', colorData.colorGroup!.contrast),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: opBackgroundColor,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0x1F2B235B)),
                ),
                child: Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    _opChip('op10', colorData.colorGroup!.op10),
                    _opChip('op20', colorData.colorGroup!.op20),
                    _opChip('op30', colorData.colorGroup!.op30),
                    _opChip('op40', colorData.colorGroup!.op40),
                    _opChip('op50', colorData.colorGroup!.op50),
                    _opChip('op60', colorData.colorGroup!.op60),
                    _opChip('op70', colorData.colorGroup!.op70),
                    _opChip('op80', colorData.colorGroup!.op80),
                    _opChip('op90', colorData.colorGroup!.op90),
                  ],
                ),
              ),
            ],
            if (colorData.colorGroupText != null) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _baseChip('main', colorData.colorGroupText!.main),
                ],
              ),
              const SizedBox(height: 12),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: opBackgroundColor,
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0x1F2B235B)),
                ),
                child: Wrap(
                  spacing: 10,
                  runSpacing: 10,
                  children: [
                    _opChip('op10', colorData.colorGroupText!.op10),
                    _opChip('op20', colorData.colorGroupText!.op20),
                    _opChip('op30', colorData.colorGroupText!.op30),
                    _opChip('op40', colorData.colorGroupText!.op40),
                    _opChip('op50', colorData.colorGroupText!.op50),
                    _opChip('op60', colorData.colorGroupText!.op60),
                    _opChip('op70', colorData.colorGroupText!.op70),
                    _opChip('op80', colorData.colorGroupText!.op80),
                    _opChip('op90', colorData.colorGroupText!.op90),
                  ],
                ),
              ),
            ],
            if (colorData.colorGroupBackground != null) ...[
              const SizedBox(height: 12),
              Wrap(
                spacing: 10,
                runSpacing: 10,
                children: [
                  _baseChip('main', colorData.colorGroupBackground!.main),
                  _baseChip('light', colorData.colorGroupBackground!.light),
                  _baseChip('dark', colorData.colorGroupBackground!.dark),
                  _baseChip('contrast', colorData.colorGroupBackground!.link),
                ],
              ),
            ],
          ],
        ),
      ),
    );
  }

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty<CardColorData>('colorData', colorData))
      ..add(DiagnosticsProperty<Color>('opBackgroundColor', opBackgroundColor))
      ..add(DoubleProperty('width', width));
  }

  Widget _baseChip(String name, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0x1F2B235B)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: const Color(0x1F2B235B)),
            ),
          ),
          const SizedBox(width: 8),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                name,
                style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF2B235B)),
              ),
              Text(
                '#${color.toARGB32().toRadixString(16).padLeft(8, '0').toUpperCase()}',
                style: const TextStyle(fontSize: 10, fontFamily: 'monospace', color: Color(0xB32B235B)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _opChip(String name, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 6),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: const Color(0x1F2B235B)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 28,
            height: 28,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: const Color(0x1F2B235B)),
            ),
          ),
          const SizedBox(width: 8),
          Text(
            name,
            style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF2B235B)),
          ),
        ],
      ),
    );
  }
}

class CardColorData {
  const CardColorData(this.name, {this.colorGroup, this.colorGroupText, this.colorGroupBackground, this.color, this.gradient});

  final String name;
  final ColorGroup? colorGroup;
  final ColorGroupText? colorGroupText;
  final ColorGroupBackground? colorGroupBackground;
  final Color? color;
  final Gradient? gradient;
}
