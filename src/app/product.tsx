import { useMemo } from "react";
import type { ProductDefinition, RouteDefinition, ScreenProps } from "@brucesantos/design-space";
import usage from "../component-usage.generated.json";
import { catalogWidgets, itemDetails, screenDescriptions, screens, type Fixture } from "../workbench";
import { catalogIds, engineFixtures, personas, scenarios, screenControls, screenData } from "./catalog";
import { components } from "./components";
import { FlutterFrame } from "./flutter";

const routeIds = new Set<string>(screens.map(([id]) => id));

// Widgets mounted per screen, recorded by the Flutter tests. Generic widgets
// (CButtonBack<void>) are matched without their type arguments.
const screensUsing = new Map<string, string[]>();
for (const [name, ids] of Object.entries(usage as Record<string, string[]>)) {
  const widget = name.replace(/<.*>$/, "");
  screensUsing.set(widget, [...(screensUsing.get(widget) ?? []), ...ids]);
}
const componentsOn = (screen: string) =>
  catalogWidgets.filter(([widget]) => screensUsing.get(widget)?.includes(screen)).map(([widget]) => catalogIds.get(widget)!);

function flutterScreen(screen: string) {
  return function FlutterScreen({ context }: ScreenProps) {
    const data = useMemo(
      () => screenData(context.fixture?.data as Fixture | undefined, context.controls, context.network),
      [context.fixture, context.controls, context.network],
    );
    return (
      <FlutterFrame
        screen={screen}
        data={data}
        device={context.viewport.id === "mobile"}
        // Screens that only exist inside Flutter (terms, password…) stay in the current frame.
        onScreen={(next) => {
          if (next !== screen && routeIds.has(next)) context.navigate(`/${next}?scenario=${next}.default`);
        }}
      />
    );
  };
}

const routes: RouteDefinition[] = screens.map(([id, name]) => ({
  path: `/${id}`,
  name,
  description: [screenDescriptions[id], itemDetails[id]].filter(Boolean).join(" "),
  screen: flutterScreen(id),
  controls: screenControls.get(id),
  components: componentsOn(id),
}));

export const product: ProductDefinition = {
  id: "bloomy-app",
  name: "Bloomy · App dos responsáveis",
  tagline: "Flutter 3.44.9 · components_bloomy 6.41.2 · referência do app 1.11.3+94",
  personas,
  defaultPersona: "responsavel",
  fixtures: engineFixtures,
  scenarios,
  routes,
  components,
  deploy: {
    env: import.meta.env.VITE_DEPLOY_ENV,
    branch: import.meta.env.VITE_DEPLOY_BRANCH,
    commit: import.meta.env.VITE_DEPLOY_COMMIT,
  },
};
