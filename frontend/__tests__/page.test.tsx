import { render } from "@testing-library/react";
import type { ReactElement } from "react";
import { expect, it } from "vitest";

it("renders without crashing", async () => {
  const { default: Home } = await import("@/app/page");
  const { container } = render(<Home />);
  expect(container).toBeTruthy();
});
