import 'package:components_bloomy/components_bloomy.dart';
import 'package:flutter_extension/flutter_extension.dart';

/// Ícones utilizados no app, concentrando as chamadas nesta classe para facilitar manutenção
///
extension UIconsExtension on UIcons {
  static Icone get error => const Icone(Icons.error_outline);
  static Icone get imageError => const Icone(Icons.broken_image);
  static Icone get loadingList => Icone(FontAwesomeIcons.fan.data, type: 1);
  static Icone get calendarEmpty =>
      Icone(FontAwesomeIcons.calendarClock.data, type: 1);
  static Icone get calendarError =>
      Icone(FontAwesomeIcons.calendarCircleExclamation.data, type: 1);
  static Icone get contentEmpty => Icone(FontAwesomeIcons.school.data, type: 1);
  static Icone get contentError =>
      Icone(FontAwesomeIcons.schoolCircleXmark.data, type: 1);

  static Icone get menu => Icone(FontAwesomeIcons.bars.data, type: 1);
  static Icone get selectHome =>
      Icone(FontAwesomeIcons.solidHome.data, type: 1);
  static Icone get unselectHome => Icone(FontAwesomeIcons.home.data, type: 1);
  static Icone get selectTrainings =>
      Icone(FontAwesomeIcons.solidCirclePlay.data, type: 1);
  static Icone get unselectTrainings =>
      Icone(FontAwesomeIcons.circlePlay.data, type: 1);
  static Icone get selectGraphics =>
      Icone(FontAwesomeIcons.solidChartLineUp.data, type: 1);
  static Icone get unselectGraphics =>
      Icone(FontAwesomeIcons.chartLineUp.data, type: 1);
  static Icone get selectSchedules =>
      Icone(FontAwesomeIcons.solidCalendarDay.data, type: 1);
  static Icone get unselectSchedules =>
      Icone(FontAwesomeIcons.calendarDay.data, type: 1);
  static Icone get selectContracts =>
      Icone(FontAwesomeIcons.solidFileSignature.data, type: 1);
  static Icone get unselectContracts =>
      Icone(FontAwesomeIcons.fileSignature.data, type: 1);
  static Icone get selectFeeds =>
      Icone(FontAwesomeIcons.solidImageLandscape.data, type: 1);
  static Icone get unselectFeeds =>
      Icone(FontAwesomeIcons.imageLandscape.data, type: 1);
  static Icone get selectNotifications =>
      Icone(FontAwesomeIcons.solidBells.data, type: 1);
  static Icone get unselectNotifications =>
      Icone(FontAwesomeIcons.bells.data, type: 1);
  static Icone get selectSettings =>
      Icone(FontAwesomeIcons.solidGear.data, type: 1);
  static Icone get unselectSettings =>
      Icone(FontAwesomeIcons.gear.data, type: 1);
  static Icone get allUsers =>
      Icone(FontAwesomeIcons.solidCircleUser.data, type: 1);

  static Icone get play =>
      Icone(FontAwesomeIcons.solidCirclePlay.data, type: 1);
  static Icone get document =>
      Icone(FontAwesomeIcons.solidFileLines.data, type: 1);
  static Icone get question =>
      Icone(FontAwesomeIcons.solidSquareQuestion.data, type: 1);

  static Icone get changeLegalGuardian =>
      Icone(FontAwesomeIcons.arrowsRotate.data, type: 1);
  static Icone get doctor => Icone(FontAwesomeIcons.userDoctor.data, type: 1);
  static Icone get calendar =>
      Icone(FontAwesomeIcons.calendarDay.data, type: 1);
  static Icone get time => Icone(FontAwesomeIcons.clock.data, type: 1);
  static Icone get pin => Icone(FontAwesomeIcons.locationPin.data, type: 1);
  static Icone get redirect =>
      Icone(FontAwesomeIcons.solidDiamondTurnRight.data, type: 1);
  static Icone get downloadPlan =>
      Icone(FontAwesomeIcons.solidDownload.data, type: 1);
  static Icone get houseBuilding =>
      Icone(FontAwesomeIcons.houseBuilding.data, type: 1);
}
