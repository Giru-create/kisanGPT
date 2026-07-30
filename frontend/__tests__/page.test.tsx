import { expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

it("redirects to /dashboard", async () => {
  const { redirect } = await import("next/navigation");
  const { default: Home } = await import("@/app/page");

  try {
    Home();
  } catch {
    // redirect() throws in test context, which is expected
  }

  expect(redirect).toHaveBeenCalledWith("/dashboard");
});
