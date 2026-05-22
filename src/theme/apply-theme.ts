import { themePresets, type ThemeId } from "./presets.js";

export function isThemeId(value: string | null): value is ThemeId {
  return Boolean(value && Object.prototype.hasOwnProperty.call(themePresets, value));
}

export function resolveThemeId(value: string | null, fallback: ThemeId): ThemeId {
  return isThemeId(value) ? value : fallback;
}

export function applyTheme(themeId: ThemeId, darkMode: boolean) {
  if (typeof document === "undefined") return;
  const theme = themePresets[themeId];
  const vars = darkMode ? theme.dark : theme.light;
  const root = document.documentElement;

  Object.entries(vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  root.classList.toggle("dark", darkMode);
}
