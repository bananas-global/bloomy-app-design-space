import type { ComponentPreview, ComponentPreviewProps } from "@brucesantos/design-space";
import { catalogSections, componentPositioning, fixtures, itemDetails, type Fixture } from "../workbench";
import { catalogIds, componentFixtures } from "./catalog";
import { FlutterFrame } from "./flutter";

const library = "components_bloomy 6.41.2 · lib/src/widgets/";

function flutterComponent(widget: string) {
  return function FlutterComponent({ data, viewport }: ComponentPreviewProps<Fixture>) {
    return (
      <FlutterFrame
        screen="library"
        component={widget}
        data={data ?? fixtures.default.data}
        device={viewport.id === "mobile"}
      />
    );
  };
}

function flutterFoundation(id: string) {
  return function FlutterFoundation({ data, fixture, viewport }: ComponentPreviewProps<Fixture>) {
    return (
      <FlutterFrame
        screen="library"
        component={`foundation:${id}`}
        data={(data as Fixture) ?? fixture?.data ?? fixtures.default.data}
        device={viewport.id === "mobile"}
      />
    );
  };
}

export const components: ComponentPreview<Fixture>[] = catalogSections.flatMap((section) => {
  const items: ComponentPreview<Fixture>[] = [];

  for (const [widget, name, source] of section.widgets ?? []) {
    items.push({
      id: catalogIds.get(widget)!,
      name,
      group: section.name,
      description: [`${widget}.`, itemDetails[widget], componentPositioning[widget]].filter(Boolean).join(" "),
      source: source.startsWith("flutter_preview/") ? source : library + source,
      preview: flutterComponent(widget),
      fixtures: componentFixtures(widget),
      defaultFixture: "default",
    });
  }

  for (const foundation of section.foundations ?? []) {
    items.push({
      id: foundation.id,
      name: foundation.name,
      group: section.name,
      description: foundation.description,
      source: foundation.source,
      preview: flutterFoundation(foundation.id),
      fixtures: componentFixtures(foundation.id),
      defaultFixture: "default",
    });
  }

  return items;
});
