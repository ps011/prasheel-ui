import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { isThemeId, resolveThemeId } from "../theme/apply-theme.js";
import { ThemeProvider, useTheme } from "../theme/theme-provider.js";
import { ThemeSwitcher } from "../theme/theme-switcher.js";

function ThemeState() {
  const { darkMode, themeId } = useTheme();

  return <div>{`${themeId}:${darkMode}`}</div>;
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  window.localStorage.clear();
  document.documentElement.className = "";
  document.documentElement.removeAttribute("style");
});

describe("ThemeProvider", () => {
  it("renders the default blue/light state", async () => {
    render(
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>,
    );

    expect(await screen.findByText("blue:false")).toBeTruthy();
  });

  it("writes colorMode storage and toggles the document dark class from ThemeSwitcher", async () => {
    render(
      <ThemeProvider storageKeys={{ colorMode: "aura:theme" }}>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const darkModeButton = await screen.findByRole("button", { name: "Switch to dark mode" });
    fireEvent.click(darkModeButton);

    await waitFor(() => {
      expect(window.localStorage.getItem("aura:theme")).toBe("dark");
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  it("restores stored theme id and dark mode from default keys", async () => {
    window.localStorage.setItem("prasheel-ui:theme-id", "rose");
    window.localStorage.setItem("prasheel-ui:dark-mode", "true");

    render(
      <ThemeProvider>
        <ThemeState />
      </ThemeProvider>,
    );

    expect(await screen.findByText("rose:true")).toBeTruthy();
    expect(document.documentElement.style.getPropertyValue("--main")).toBe("#fb7185");
  });

  it("still applies theme when localStorage access throws", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("storage blocked");
    });

    render(
      <ThemeProvider>
        <ThemeSwitcher />
        <ThemeState />
      </ThemeProvider>,
    );

    expect(await screen.findByText("blue:false")).toBeTruthy();

    fireEvent.click(await screen.findByRole("button", { name: "Switch to dark mode" }));

    await waitFor(() => {
      expect(document.documentElement.classList.contains("dark")).toBe(true);
    });
  });

  it("closes the theme color listbox with Escape", async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    fireEvent.click(await screen.findByRole("button", { name: "Choose theme color" }));
    const listbox = await screen.findByRole("listbox", { name: "Theme colors" });

    fireEvent.keyDown(listbox.querySelector("[role='option']") as Element, {
      key: "Escape",
    });

    await waitFor(() => {
      expect(screen.queryByRole("listbox", { name: "Theme colors" })).toBeNull();
    });
  });

  it("closes the theme color listbox with Escape from the trigger", async () => {
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>,
    );

    const trigger = await screen.findByRole("button", { name: "Choose theme color" });
    fireEvent.click(trigger);
    expect(await screen.findByRole("listbox", { name: "Theme colors" })).toBeTruthy();

    fireEvent.keyDown(trigger, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("listbox", { name: "Theme colors" })).toBeNull();
    });
  });

  it("rejects inherited properties as theme ids", () => {
    expect(isThemeId("toString")).toBe(false);
    expect(resolveThemeId("toString", "blue")).toBe("blue");
  });
});
