import 'package:flutter_extension/flutter_extension.dart';

import 'package:components_bloomy/components_bloomy.dart' hide CAvatarUpdater;

// Candidate change based on components_bloomy 6.39.0. Data and style contracts
// remain unchanged; presentation follows Figma nodes 2339:4997 and 2339:5002.

class CAvatarUpdater extends StatefulWidget {
  const CAvatarUpdater(
    this.data,
    this.style, {
    this.focusNode,
    this.onAvatarTap,
    super.key,
  });

  final CAvatarUpdaterData data;
  final IAvatarUpdaterStyle style;

  final FocusNode? focusNode;
  final void Function(AvatarUserData avatarUserData)? onAvatarTap;

  @override
  State<CAvatarUpdater> createState() => _CAvatarUpdaterState();

  @override
  void debugFillProperties(DiagnosticPropertiesBuilder properties) {
    super.debugFillProperties(properties);
    properties
      ..add(DiagnosticsProperty<CAvatarUpdaterData>('data', data))
      ..add(DiagnosticsProperty<IAvatarUpdaterStyle>('style', style))
      ..add(DiagnosticsProperty<FocusNode?>('focusNode', focusNode))
      ..add(ObjectFlagProperty<void Function(AvatarUserData avatarUserData)>.has('onAvatarChanged', onAvatarTap));
  }
}

class _CAvatarUpdaterState extends State<CAvatarUpdater> {
  var _index = 0;

  @override
  Widget build(BuildContext context) {
    final total = widget.data.avatarUsersData.length;
    final remainingUsers = List.generate(total - 1, (i) => MapEntry((_index + 1 + i) % total, widget.data.avatarUsersData[(_index + 1 + i) % total]));

    // Show the three secondary profiles from the Figma reference; retain an
    // overflow indicator for longer lists without changing the data contract.
    final showPlus = remainingUsers.length > 3;
    final avatarsToShow = remainingUsers.take(showPlus ? 2 : 3).toList();
    final selected = widget.data.avatarUsersData[_index];
    final colors = context.theme<BloomyColors>();

    Widget avatar(AvatarUserData user, IAvatarStyle style) => CAvatar(
      CAvatarData(
        imageUrl: user.avatarUrl.toString(),
        defaultAbbreviationName: Name(user.title).abbreviation,
        defaultPriority: DefaultPriority.abbreviation,
      ),
      style,
    );

    final count = avatarsToShow.length + (showPlus ? 1 : 0);
    final groupWidth = count == 0 ? 0.0 : 52.0 + (count - 1) * 26;
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: LayoutBuilder(builder: (context, constraints) {
              // Keep the primary portrait centered even when the profile count
              // changes. On narrow widths only the secondary group scales down.
              final availableSide = ((constraints.maxWidth - 124) / 2 - 8).clamp(0.0, 104.0);
              return SizedBox(
                height: 124,
                child: Stack(
                  clipBehavior: Clip.none,
                  children: [
                    Align(
                      alignment: Alignment.bottomCenter,
                      child: Semantics(
                        label: 'Editar foto de ${selected.title}',
                        button: true,
                        enabled: widget.data.isEnabled,
                        child: InkWell(
                          focusNode: widget.focusNode,
                          borderRadius: BorderRadius.circular(100),
                          onTap: widget.data.isEnabled ? () => widget.onAvatarTap?.call(selected) : null,
                          child: Stack(
                            clipBehavior: Clip.none,
                            children: [
                              avatar(selected, const _ProfileAvatarStyle(main: true)),
                              Positioned(
                                top: 0,
                                right: 0,
                                child: ExcludeSemantics(
                                  child: IgnorePointer(
                                    child: Container(
                                      width: 32,
                                      height: 32,
                                      decoration: BoxDecoration(
                                        color: colors?.background.light,
                                        shape: BoxShape.circle,
                                        border: Border.all(color: colors?.text.op20 ?? Colors.transparent),
                                      ),
                                      alignment: Alignment.center,
                                      child: CIcon(widget.data.editButtonIcon, CIconDefaultStyle(customSizeValue: 16, customColor: colors?.primary.main)),
                                    ),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    if (remainingUsers.isNotEmpty)
                      Positioned(
                        right: 0,
                        bottom: 0,
                        child: Semantics(
                          label: 'Trocar perfil',
                          button: true,
                          child: InkWell(
                            borderRadius: BorderRadius.circular(50),
                            onTap: () => setState(() => _index = (_index + 1) % total),
                            child: SizedBox(
                              width: groupWidth.clamp(0.0, availableSide),
                              height: 52,
                              child: FittedBox(
                                fit: BoxFit.scaleDown,
                                alignment: Alignment.bottomRight,
                                child: SizedBox(
                                  width: groupWidth,
                                  height: 52,
                                  child: Stack(
                                    clipBehavior: Clip.none,
                                    children: [
                                      if (showPlus)
                                        Positioned(
                                          right: 0,
                                          child: _ProfileOutline(
                                            child: Container(
                                              width: 52,
                                              height: 52,
                                              alignment: Alignment.center,
                                              decoration: BoxDecoration(color: colors?.primary.light, shape: BoxShape.circle),
                                              child: Text('+${remainingUsers.length - 2}', style: TextStyle(fontFamily: TFontFamily.nunitoSans, fontWeight: FontWeight.w900, fontSize: 20, color: colors?.primary.dark)),
                                            ),
                                          ),
                                        ),
                                      for (int i = avatarsToShow.length - 1; i >= 0; i--)
                                        Positioned(
                                          left: i * 26,
                                          child: _ProfileOutline(child: avatar(avatarsToShow[i].value, const _ProfileAvatarStyle(main: false))),
                                        ),
                                    ],
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
              );
            }),
          ),
          const SizedBox(height: 8),
          Text(selected.title, textAlign: TextAlign.center, style: widget.style.titleTextStyle(context)?.copyWith(color: colors?.text.main, fontSize: 20, height: 1.35)),
          if (selected.subtitle != null) ...[
            SizedBox(height: widget.style.gapTitleAndSubtitle(context)),
            Text(selected.subtitle!, textAlign: TextAlign.center, style: widget.style.subtitleTextStyle(context)),
          ],
        ],
      ),
    );
  }
}

// Style the existing CAvatar instead of duplicating image/fallback handling.
class _ProfileAvatarStyle extends CAvatarCircleStyle {
  const _ProfileAvatarStyle({required this.main});
  final bool main;

  @override
  Size size(BuildContext context) => Size.square(main ? 120 : 52);
  @override
  EdgeInsets borderPadding(BuildContext context) => EdgeInsets.all(main ? 2 : 0);
  @override
  Color? backgroundColor(BuildContext context) => context.theme<BloomyColors>()?.primary.light;
  @override
  Color? foregroundColor(BuildContext context) => context.theme<BloomyColors>()?.primary.dark;
  @override
  TextStyle abbreviationNameStyle(BuildContext context) => TextStyle(fontFamily: TFontFamily.nunitoSans, fontWeight: FontWeight.w900, fontSize: main ? 48 : 20, height: 1.35);
}

class _ProfileOutline extends StatelessWidget {
  const _ProfileOutline({required this.child});
  final Widget child;

  @override
  Widget build(BuildContext context) => DecoratedBox(
    decoration: BoxDecoration(
      shape: BoxShape.circle,
      boxShadow: [BoxShadow(color: context.theme<BloomyColors>()?.background.main ?? Theme.of(context).scaffoldBackgroundColor, spreadRadius: 3)],
    ),
    child: child,
  );
}
