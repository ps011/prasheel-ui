"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { applyTheme, resolveThemeId } from "./apply-theme.js";
import { themeIds, themePresets, type ThemeId } from "./presets.js";

export type ThemeStorageKeys = {
  themeId?: string;
  darkMode?: string;
  colorMode?: string;
};

export type ThemeProviderProps = {
  children: ReactNode;
  defaultThemeId?: ThemeId;
  defaultDarkMode?: boolean;
  storageKeys?: ThemeStorageKeys;
  useSystemDarkMode?: boolean;
};

export type ThemeOption = {
  id: ThemeId;
  name: string;
};

export type ThemeContextValue = {
  themeId: ThemeId;
  darkMode: boolean;
  setThemeId: (themeId: ThemeId) => void;
  setDarkMode: (darkMode: boolean) => void;
  toggleDarkMode: () => void;
  themeOptions: ThemeOption[];
  mounted: boolean;
};

const defaultStorageKeys = {
  themeId: "prasheel-ui:theme-id",
  darkMode: "prasheel-ui:dark-mode",
} satisfies ThemeStorageKeys;

const ThemeContext = createContext<ThemeContextValue | null>(null);

function safeGetStorageItem(key: string) {
  if (typeof window === "undefined") return null;

  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSetStorageItem(key: string, value: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Storage can be blocked in private or embedded browser contexts.
  }
}

function getSystemDarkMode() {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readStoredDarkMode(storageKeys: ThemeStorageKeys) {
  if (typeof window === "undefined") return null;

  if (storageKeys.colorMode) {
    const storedColorMode = safeGetStorageItem(storageKeys.colorMode);
    if (storedColorMode === "dark") return true;
    if (storedColorMode === "light") return false;
  }

  if (storageKeys.darkMode) {
    const storedDarkMode = safeGetStorageItem(storageKeys.darkMode);
    if (storedDarkMode === "true") return true;
    if (storedDarkMode === "false") return false;
  }

  return null;
}

export function ThemeProvider({
  children,
  defaultThemeId = "blue",
  defaultDarkMode = false,
  storageKeys,
  useSystemDarkMode = false,
}: ThemeProviderProps) {
  const resolvedStorageKeys = useMemo(
    () => {
      const merged: ThemeStorageKeys = {
        ...defaultStorageKeys,
        ...storageKeys,
      };

      if (
        storageKeys?.colorMode &&
        !Object.prototype.hasOwnProperty.call(storageKeys, "darkMode")
      ) {
        delete merged.darkMode;
      }

      return merged;
    },
    [storageKeys],
  );
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);
  const [darkMode, setDarkMode] = useState(defaultDarkMode);
  const [mounted, setMounted] = useState(false);

  const themeOptions = useMemo(
    () => themeIds.map((id) => ({ id, name: themePresets[id].name })),
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    const storedThemeId = resolvedStorageKeys.themeId
      ? safeGetStorageItem(resolvedStorageKeys.themeId)
      : null;
    const nextThemeId = resolveThemeId(storedThemeId, defaultThemeId);
    const storedDarkMode = readStoredDarkMode(resolvedStorageKeys);
    const nextDarkMode =
      storedDarkMode ?? (useSystemDarkMode ? getSystemDarkMode() : defaultDarkMode);

    setThemeId(nextThemeId);
    setDarkMode(nextDarkMode);
    applyTheme(nextThemeId, nextDarkMode);
    setMounted(true);
  }, [defaultDarkMode, defaultThemeId, resolvedStorageKeys, useSystemDarkMode]);

  useEffect(() => {
    if (!mounted) return;

    applyTheme(themeId, darkMode);

    if (typeof window === "undefined") return;

    if (resolvedStorageKeys.themeId) {
      safeSetStorageItem(resolvedStorageKeys.themeId, themeId);
    }

    if (resolvedStorageKeys.colorMode) {
      safeSetStorageItem(resolvedStorageKeys.colorMode, darkMode ? "dark" : "light");
    }

    if (resolvedStorageKeys.darkMode) {
      safeSetStorageItem(resolvedStorageKeys.darkMode, String(darkMode));
    }
  }, [darkMode, mounted, resolvedStorageKeys, themeId]);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((currentDarkMode) => !currentDarkMode);
  }, []);

  const value = useMemo<ThemeContextValue>(
    () => ({
      themeId,
      darkMode,
      setThemeId,
      setDarkMode,
      toggleDarkMode,
      themeOptions,
      mounted,
    }),
    [darkMode, mounted, themeId, themeOptions, toggleDarkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);

  if (!value) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return value;
}
