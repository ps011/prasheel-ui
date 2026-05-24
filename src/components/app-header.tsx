"use client";

import { Menu } from "lucide-react";
import * as React from "react";
import { cn } from "../utils.js";
import { ThemeSwitcher } from "../theme/theme-switcher.js";
import { Button, buttonVariants } from "./button.js";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet.js";

export type AppHeaderLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

export type AppHeaderNavItem = {
  href: string;
  label: React.ReactNode;
  active?: boolean;
  ariaLabel?: string;
  target?: React.HTMLAttributeAnchorTarget;
  rel?: string;
};

export type AppHeaderProps = Omit<React.ComponentPropsWithoutRef<"header">, "children"> & {
  brand: React.ReactNode;
  brandHref?: string;
  brandLabel?: string;
  linkComponent?: React.ElementType<AppHeaderLinkProps>;
  navItems?: AppHeaderNavItem[];
  navLabel?: string;
  openMenuLabel?: string;
  menuLabel?: React.ReactNode;
  showThemeSwitcher?: boolean;
  themeSwitcher?: React.ReactNode;
  themeSwitcherClassName?: string;
  sticky?: boolean;
  breakpoint?: "md" | "lg";
  containerClassName?: string;
  brandClassName?: string;
  desktopNavClassName?: string;
  navLinkClassName?: string;
  activeNavLinkClassName?: string;
  mobileContainerClassName?: string;
  mobileTriggerClassName?: string;
  mobileSheetClassName?: string;
  mobileNavLinkClassName?: string;
};

const breakpointClasses = {
  md: {
    desktop: "hidden md:flex",
    mobile: "flex md:hidden",
  },
  lg: {
    desktop: "hidden lg:flex",
    mobile: "flex lg:hidden",
  },
};

function getExternalRel(item: AppHeaderNavItem) {
  if (item.rel) return item.rel;
  return item.target === "_blank" ? "noreferrer" : undefined;
}

export function AppHeader({
  brand,
  brandHref,
  brandLabel,
  linkComponent,
  navItems = [],
  navLabel = "Primary navigation",
  openMenuLabel = "Open navigation menu",
  menuLabel = "Menu",
  showThemeSwitcher = true,
  themeSwitcher,
  themeSwitcherClassName,
  sticky = true,
  breakpoint = "lg",
  className,
  containerClassName,
  brandClassName,
  desktopNavClassName,
  navLinkClassName,
  activeNavLinkClassName,
  mobileContainerClassName,
  mobileTriggerClassName,
  mobileSheetClassName,
  mobileNavLinkClassName,
  ...props
}: AppHeaderProps) {
  const LinkComponent = linkComponent ?? "a";
  const hasNavItems = navItems.length > 0;
  const responsiveClasses = breakpointClasses[breakpoint];

  function renderThemeSwitcher(className?: string) {
    if (!showThemeSwitcher) return null;
    if (themeSwitcher) return themeSwitcher;
    return <ThemeSwitcher className={cn(themeSwitcherClassName, className)} />;
  }

  function renderLink(
    item: AppHeaderNavItem,
    className?: string,
  ) {
    return (
      <LinkComponent
        href={item.href}
        aria-current={item.active ? "page" : undefined}
        aria-label={item.ariaLabel}
        className={className}
        rel={getExternalRel(item)}
        target={item.target}
      >
        {item.label}
      </LinkComponent>
    );
  }

  function renderBrand() {
    const brandContent = <span className="inline-flex items-center">{brand}</span>;

    if (!brandHref) {
      return (
        <div className={cn("shrink-0 text-xl font-bold tracking-tight text-foreground", brandClassName)}>
          {brandContent}
        </div>
      );
    }

    return (
      <LinkComponent
        href={brandHref}
        aria-label={brandLabel}
        className={cn(
          "shrink-0 text-xl font-bold tracking-tight text-foreground no-underline",
          brandClassName,
        )}
      >
        {brandContent}
      </LinkComponent>
    );
  }

  const desktopThemeSwitcher = renderThemeSwitcher("shrink-0");
  const desktopActions = hasNavItems || desktopThemeSwitcher;

  return (
    <header
      className={cn(
        "z-50 w-full border-b-2 border-border bg-background",
        sticky && "sticky top-0",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          "container mx-auto flex items-center justify-between gap-3 px-4 py-3",
          containerClassName,
        )}
      >
        {renderBrand()}

        {desktopActions ? (
          <div
            role={hasNavItems ? "navigation" : undefined}
            aria-label={hasNavItems ? navLabel : undefined}
            className={cn(
              responsiveClasses.desktop,
              "items-center justify-end gap-2",
              desktopNavClassName,
            )}
          >
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant={item.active ? "default" : "neutral"}
                size="default"
                className={cn(item.active && activeNavLinkClassName)}
                asChild
              >
                {renderLink(item, cn("no-underline", navLinkClassName))}
              </Button>
            ))}
            {desktopThemeSwitcher}
          </div>
        ) : null}

        {hasNavItems ? (
          <div className={cn(responsiveClasses.mobile, "items-center", mobileContainerClassName)}>
            <Sheet>
              <SheetTrigger
                type="button"
                aria-label={openMenuLabel}
                className={cn(
                  buttonVariants({ variant: "neutral", size: "icon" }),
                  "bg-main-foreground text-main",
                  mobileTriggerClassName,
                )}
              >
                <Menu aria-hidden="true" className="size-6" />
              </SheetTrigger>
              <SheetContent side="right" className={cn("w-[min(100vw-2rem,320px)]", mobileSheetClassName)}>
                <SheetHeader>
                  <SheetTitle className="text-left">{menuLabel}</SheetTitle>
                </SheetHeader>
                <nav aria-label={navLabel}>
                  <ul className="mt-6 flex flex-col gap-2">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Button
                          variant={item.active ? "default" : "neutral"}
                          size="default"
                          className="w-full justify-start text-left"
                          asChild
                        >
                          {renderLink(item, cn("w-full no-underline", mobileNavLinkClassName))}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
                {showThemeSwitcher ? (
                  <div className="mt-4">{renderThemeSwitcher("w-full justify-start")}</div>
                ) : null}
              </SheetContent>
            </Sheet>
          </div>
        ) : null}
      </div>
    </header>
  );
}
