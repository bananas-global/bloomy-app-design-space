import type { ComponentPreview, ComponentPreviewProps } from "@brucesantos/design-space";
import { catalogWidgets, componentPositioning, fixtures, itemDetails, type Fixture } from "../workbench";
import { catalogIds, componentFixtures } from "./catalog";
import { FlutterFrame } from "./flutter";

const sections = new Set(["FeedSection", "AppointmentsSection"]);
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

export const components: ComponentPreview<Fixture>[] = catalogWidgets.map(([widget, name, source]) => ({
  id: catalogIds.get(widget)!,
  name,
  group: sections.has(widget) ? "Composições" : "components_bloomy",
  // The widget name goes first so the search finds it.
  description: [`${widget}.`, itemDetails[widget], componentPositioning[widget]].filter(Boolean).join(" "),
  source: source.startsWith("flutter_preview/") ? source : library + source,
  preview: flutterComponent(widget),
  fixtures: componentFixtures(widget),
  defaultFixture: "default",
}));
