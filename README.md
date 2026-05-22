# @prasheel/ui

Reusable React UI primitives, theme tokens, CSS, and Tailwind preset for Prasheel's apps.

## Install Locally

From a sibling repo under `/Users/prasheelsoni/repos/personal`:

```bash
npm install ../prasheel-ui
```

## App CSS

Import the package CSS once from the app's global entry:

```ts
import "@prasheel/ui/styles.css";
```

`@prasheel/ui/styles.css` includes base theme variables, app typography defaults, and markdown styles.

## Tailwind

Use the package preset and scan the package output:

```js
const { preset } = require("@prasheel/ui/tailwind");

module.exports = {
  presets: [preset],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "./node_modules/@prasheel/ui/dist/**/*.{js,mjs}",
  ],
};
```

Vite ESM configs can import the same preset:

```js
import { preset } from "@prasheel/ui/tailwind";

export default {
  presets: [preset],
  content: ["./index.html", "./src/**/*.{ts,tsx}", "./node_modules/@prasheel/ui/dist/**/*.{js,mjs}"],
};
```

## Theme

Wrap the app with `ThemeProvider`:

```tsx
import { ThemeProvider } from "@prasheel/ui";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider useSystemDarkMode>{children}</ThemeProvider>;
}
```

Use `storageKeys.colorMode` for apps that already store `"light"` or `"dark"` in one key:

```tsx
<ThemeProvider storageKeys={{ colorMode: "aura:theme" }} useSystemDarkMode>
  {children}
</ThemeProvider>
```

## Components

```tsx
import { Button, Card, CardContent, ThemeSwitcher } from "@prasheel/ui";

export function Example() {
  return (
    <Card>
      <CardContent className="p-6">
        <ThemeSwitcher />
        <Button>Continue</Button>
      </CardContent>
    </Card>
  );
}
```
