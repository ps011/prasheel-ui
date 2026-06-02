import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Checkbox, Input, Textarea } from "../index.js";

describe("form controls", () => {
  it("renders an input with design-system field styling", () => {
    render(<Input aria-label="Title" defaultValue="Draft" />);

    const input = screen.getByLabelText("Title");

    expect(input).toHaveValue("Draft");
    expect(input).toHaveClass("w-full");
    expect(input).toHaveClass("min-w-0");
    expect(input).toHaveClass("rounded-base");
    expect(input).toHaveClass("border-border");
  });

  it("renders a textarea with design-system field styling", () => {
    render(<Textarea aria-label="Body" defaultValue="Markdown" />);

    const textarea = screen.getByLabelText("Body");

    expect(textarea).toHaveValue("Markdown");
    expect(textarea).toHaveClass("w-full");
    expect(textarea).toHaveClass("min-w-0");
    expect(textarea).toHaveClass("rounded-base");
    expect(textarea).toHaveClass("border-border");
  });

  it("renders a checkbox with design-system field styling", () => {
    render(<Checkbox aria-label="Published" defaultChecked />);

    const checkbox = screen.getByLabelText("Published");

    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveClass("size-4");
    expect(checkbox).toHaveClass("accent-main");
  });
});
