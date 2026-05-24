import { describe, expect, it } from "vitest";
import {
  Accordion,
  AppHeader,
  Avatar,
  Button,
  Card,
  Sheet,
  ThemeProvider,
  cn,
  themePresets,
} from "../index.js";

describe("public exports", () => {
  it("exports core components and utilities", () => {
    expect(Button).toBeTypeOf("function");
    expect(Card).toBeTypeOf("function");
    expect(ThemeProvider).toBeTypeOf("function");
    expect(cn("a", false, "b")).toBe("a b");
    expect(themePresets.blue.name).toBe("Blue");
  });

  it("exports Task 4 component entry points", () => {
    expect(Accordion).toBeDefined();
    expect(AppHeader).toBeDefined();
    expect(Avatar).toBeDefined();
    expect(Sheet).toBeDefined();
  });
});
