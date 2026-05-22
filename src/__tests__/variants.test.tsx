import { describe, expect, it } from "vitest";
import { badgeVariants, buttonVariants } from "../index.js";

describe("component variants", () => {
  it("generates the default button style", () => {
    expect(buttonVariants({ variant: "default", size: "default" })).toContain("bg-main");
    expect(buttonVariants({ variant: "default", size: "default" })).toContain("shadow-shadow");
  });

  it("generates the destructive button style", () => {
    expect(buttonVariants({ variant: "destructive", size: "default" })).toContain("bg-red-500");
  });

  it("generates the neutral badge style", () => {
    expect(badgeVariants({ variant: "neutral" })).toContain("bg-secondary-background");
  });

  it("generates status badge styles", () => {
    expect(badgeVariants({ variant: "success" })).toContain("bg-green-500");
    expect(badgeVariants({ variant: "warning" })).toContain("bg-yellow-400");
    expect(badgeVariants({ variant: "destructive" })).toContain("bg-red-500");
  });
});
