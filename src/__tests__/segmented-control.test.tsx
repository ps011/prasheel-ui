import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SegmentedControl } from "../index.js";

describe("segmented control", () => {
  it("announces the active option and reports selection changes", () => {
    const onValueChange = vi.fn();
    render(<SegmentedControl aria-label="Review view" value="graph" options={[{ value: "graph", label: "Graph" }, { value: "walkthrough", label: "Walkthrough" }]} onValueChange={onValueChange} />);
    expect(screen.getByRole("group", { name: "Review view" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Graph" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Walkthrough" }));
    expect(onValueChange).toHaveBeenCalledWith("walkthrough");
  });
});
