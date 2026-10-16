import { createRoot } from "react-dom/client";
import { DesignSpace } from "@brucesantos/design-space";
import "@brucesantos/design-space/styles.css";
import { screens } from "./workbench";
import { catalogIds, scenarios } from "./app/catalog";
import { components } from "./app/components";
import { legacyLocation } from "./app/legacy";
import { product } from "./app/product";

if (window.self === window.top) {
  const legacy = legacyLocation(location.pathname, location.search, {
    screens: new Set(screens.map(([id]) => id)),
    scenarios: new Set(scenarios.map((scenario) => scenario.id)),
    components: catalogIds,
    componentFixtures: new Map(components.map((c) => [c.id, new Set((c.fixtures ?? []).map((f) => f.id))])),
  });
  if (legacy) history.replaceState(null, "", legacy);
}

createRoot(document.getElementById("root")!).render(<DesignSpace product={product} />);
