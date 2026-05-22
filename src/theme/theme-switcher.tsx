"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Moon, Palette, Sun } from "lucide-react";
import { cn } from "../utils.js";
import { useTheme } from "./theme-provider.js";
import { themePresets } from "./presets.js";

export type ThemeSwitcherProps = {
  className?: string;
};

export function ThemeSwitcher({ className }: ThemeSwitcherProps) {
  const {
    darkMode,
    mounted,
    setDarkMode,
    setThemeId,
    themeId,
    themeOptions,
  } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const selectedTheme = themeOptions.find((themeOption) => themeOption.id === themeId);
  const selectedIndex = Math.max(
    0,
    themeOptions.findIndex((themeOption) => themeOption.id === themeId),
  );

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  function focusOption(index: number) {
    optionRefs.current[index]?.focus();
  }

  function openAndFocusSelected() {
    setOpen(true);
    window.setTimeout(() => focusOption(selectedIndex), 0);
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocusSelected();
    }
  }

  function handleOptionKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusOption((index + 1) % themeOptions.length);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusOption((index - 1 + themeOptions.length) % themeOptions.length);
      return;
    }

    if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
      return;
    }

    if (event.key === "End") {
      event.preventDefault();
      focusOption(themeOptions.length - 1);
    }
  }

  return (
    <div ref={rootRef} className={cn("relative inline-flex items-center gap-2", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Choose theme color"
        className="inline-flex h-10 items-center gap-2 rounded-[5px] border-2 border-[var(--border)] bg-[var(--secondary-background)] px-3 text-sm font-bold text-[var(--foreground)] shadow-[3px_3px_0_0_var(--border)] transition-transform hover:-translate-y-0.5"
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        onKeyDown={handleTriggerKeyDown}
      >
        <Palette aria-hidden="true" className="h-4 w-4" />
        <span>{mounted ? selectedTheme?.name : "Theme"}</span>
      </button>

      <button
        type="button"
        aria-label={mounted && darkMode ? "Switch to light mode" : "Switch to dark mode"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-[5px] border-2 border-[var(--border)] bg-[var(--main)] text-[var(--main-foreground)] shadow-[3px_3px_0_0_var(--border)] transition-transform hover:-translate-y-0.5"
        onClick={() => setDarkMode(!darkMode)}
      >
        {mounted && darkMode ? (
          <Sun aria-hidden="true" className="h-4 w-4" />
        ) : (
          <Moon aria-hidden="true" className="h-4 w-4" />
        )}
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Theme colors"
          className="absolute right-0 top-12 z-50 grid max-h-[min(70vh,32rem)] w-44 gap-1 overflow-y-auto rounded-[5px] border-2 border-[var(--border)] bg-[var(--secondary-background)] p-2 shadow-[4px_4px_0_0_var(--border)]"
        >
          {themeOptions.map((themeOption, index) => (
            <button
              key={themeOption.id}
              ref={(node) => {
                optionRefs.current[index] = node;
              }}
              type="button"
              role="option"
              aria-selected={themeOption.id === themeId}
              tabIndex={themeOption.id === themeId ? 0 : -1}
              className={cn(
                "flex items-center gap-2 rounded-[5px] border-2 border-transparent px-2 py-1.5 text-left text-sm font-bold text-[var(--foreground)]",
                themeOption.id === themeId && "border-[var(--border)] bg-[var(--background)]",
              )}
              onKeyDown={(event) => handleOptionKeyDown(event, index)}
              onClick={() => {
                setThemeId(themeOption.id);
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <span
                aria-hidden="true"
                className="h-4 w-4 rounded-full border-2 border-[var(--border)]"
                style={{
                  backgroundColor:
                    themePresets[themeOption.id][darkMode ? "dark" : "light"]["--main"],
                }}
              />
              <span>{themeOption.name}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
