import { describe, expect, it } from "vitest";
import { validateProduct } from "@brucesantos/design-space";
import { assertValidProduct } from "@brucesantos/design-space/testing";
import { applyControls, catalogIds, componentId, decodeValue, encodeValue, scenarios, screenData } from "../src/app/catalog";
import { components } from "../src/app/components";
import { legacyLocation } from "../src/app/legacy";
import { product } from "../src/app/product";
import { fixtures, patchComponent, screens } from "../src/workbench";

describe("product contract", () => {
  it("passes the engine validation without errors or warnings", () => {
    assertValidProduct(product);
    expect(validateProduct(product)).toEqual([]);
  });

  it("offers one variation per screen fixture", () => {
    expect(product.routes.map((route) => route.path)).toEqual(screens.map(([id]) => `/${id}`));
    expect(scenarios).toHaveLength(39);
    expect(scenarios.find((s) => s.id === "home.populated")?.fixture).toBe("populated");
  });

  it("pins each variation to its own fixture data", () => {
    for (const scenario of scenarios) {
      const data = fixtures[scenario.fixture].data;
      expect(applyControls(data, scenario.controls ?? {}), scenario.id).toEqual(patchComponent(data, {}));
    }
  });

  it("maps the network selector to the screen states", () => {
    expect(screenData(fixtures.populated.data, {}, "loading")).toMatchObject({ state: "loading", feedState: "loading", scheduleState: "loading" });
    expect(screenData(fixtures.populated.data, {}, "error")).toMatchObject({ state: "error", feedState: "error" });
    expect(screenData(fixtures.default.data, {}, "empty")).toMatchObject({ feedState: "empty", showContent: false });
    expect(screenData(fixtures.populated.data, {}, "success")).toEqual(patchComponent(fixtures.populated.data, {}));
  });

  it("explains on the control when an option has no effect", () => {
    const post = product.routes.find((route) => route.path === "/home")?.controls?.find((group) => group.component === "card-feed");
    expect(post?.controls.find((control) => control.id === "postMedia")?.description).toBe("Disponível quando o feed está preenchido.");
  });

  it("restores typed values and empty strings from the URL", () => {
    expect(encodeValue("")).toBe("vazio");
    expect(decodeValue("vazio")).toBe("");
    expect(applyControls(fixtures.default.data, { searchText: "vazio", hasSupervisor: "true", scheduleCount: "3" })).toMatchObject({
      searchText: "",
      hasSupervisor: true,
      scheduleCount: "3",
    });
  });
});

describe("component catalog", () => {
  it("uses kebab-case ids", () => {
    expect(componentId("CAppBarUser2")).toBe("app-bar-user-2");
    expect(componentId("CTileScheduleParent")).toBe("tile-schedule-parent");
    expect(componentId("FeedSection")).toBe("feed-section");
    expect(componentId("CButton")).toBe("button");
  });

  it("gives every component ready-made examples, starting with the default", () => {
    expect(components).toHaveLength(22);
    for (const component of components) {
      expect(component.fixtures?.[0]?.id, component.id).toBe("default");
      expect(new Set(component.fixtures?.map((f) => f.id)).size, component.id).toBe(component.fixtures?.length);
    }
  });

  it("lists the catalog components each screen mounts", () => {
    const home = product.routes.find((route) => route.path === "/home");
    expect(home?.components).toEqual(expect.arrayContaining(["app-bar-user-2", "feed-section", "card-feed", "tile-schedule-parent"]));
    const settings = product.routes.find((route) => route.path === "/settings");
    expect(settings?.components).toContain("button-back");
  });
});

describe("legacy links", () => {
  const catalog = {
    screens: new Set(screens.map(([id]) => id)),
    scenarios: new Set(scenarios.map((s) => s.id)),
    components: catalogIds,
    componentFixtures: new Map(components.map((c) => [c.id, new Set((c.fixtures ?? []).map((f) => f.id))])),
  };
  const open = (search: string, pathname = "/") => legacyLocation(pathname, search, catalog);

  it("opens the matching screen variation", () => {
    expect(open("?view=canvas&screen=agenda&fixture=week&viewport=mobile")).toBe("/agenda?scenario=agenda.week&viewport=mobile");
    expect(open("?screen=home&fixture=reference")).toBe("/home?scenario=home.default&viewport=mobile");
  });

  it("falls back to the default variation for custom or unknown data", () => {
    expect(open("?view=canvas&screen=home&fixture=custom&data=%7B%7D")).toBe("/home?scenario=home.default&viewport=mobile");
    expect(open("?view=canvas&screen=contracts")).toBe("/home?scenario=home.default&viewport=mobile");
  });

  it("opens isolated components and keeps tablet or fit sizes", () => {
    expect(open("?view=library&component=CCardFeed&fixture=photo&viewport=tablet")).toBe("/?component=card-feed&fixture=photo&viewport=tablet");
    expect(open("?view=canvas&screen=feed&viewport=fluid")).toBe("/feed?scenario=feed.default");
  });

  it("leaves engine URLs alone", () => {
    expect(open("?scenario=home.default", "/home")).toBeUndefined();
    expect(open("")).toBeUndefined();
  });
});
