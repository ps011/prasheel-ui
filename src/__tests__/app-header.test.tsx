import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppHeader, ThemeProvider } from "../index.js";

function renderHeader(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

describe("AppHeader", () => {
  it("renders a linked brand, nav links, and the theme switcher", () => {
    renderHeader(
      <AppHeader
        brand="Portfolio"
        brandHref="/"
        navItems={[
          { href: "/about", label: "About" },
          { href: "/blog", label: "Blog", active: true },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: "Portfolio" }).getAttribute("href")).toBe("/");
    expect(screen.getAllByRole("link", { name: "About" })[0].getAttribute("href")).toBe(
      "/about",
    );
    expect(screen.getAllByRole("link", { name: "Blog" })[0].getAttribute("aria-current")).toBe(
      "page",
    );
    expect(screen.getByRole("button", { name: "Choose theme color" })).toBeTruthy();
  });

  it("supports a custom link component for app routers", () => {
    function RouterLink({
      href,
      children,
      ...props
    }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
      return (
        <a data-router-link="true" href={href} {...props}>
          {children}
        </a>
      );
    }

    renderHeader(
      <AppHeader
        brand="Aura"
        brandHref="/"
        linkComponent={RouterLink}
        navItems={[{ href: "/history", label: "History" }]}
      />,
    );

    expect(screen.getByRole("link", { name: "Aura" }).getAttribute("data-router-link")).toBe(
      "true",
    );
    expect(
      screen.getAllByRole("link", { name: "History" })[0].getAttribute("data-router-link"),
    ).toBe("true");
  });

  it("can render without nav items and without a theme switcher", () => {
    renderHeader(<AppHeader brand="Should I buy it?" showThemeSwitcher={false} />);

    expect(screen.getByText("Should I buy it?")).toBeTruthy();
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.queryByRole("button", { name: "Choose theme color" })).toBeNull();
  });
});
