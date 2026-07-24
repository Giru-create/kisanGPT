import React from "react";
import { render } from "@testing-library/react";
import { expect, it } from "vitest";
import { ThemeProvider } from "@/store/themeStore";

it("renders without crashing", async () => {
  const { default: Home } = await import("@/app/page");
  const { container } = render(
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
  expect(container).toBeTruthy();
});
