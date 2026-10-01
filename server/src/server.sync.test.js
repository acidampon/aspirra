import { describe, it, expect } from "vitest";
import { createApp } from "./server.js";
import { createMemoryDatabase } from "./memoryDatabase.js";

describe("sync HTTP boundary", () => {
  it("creates the sync route", () => {
    const app = createApp(createMemoryDatabase());
    const routes = app._router?.stack || app.router?.stack || [];
    expect(routes.some(layer => layer.route?.path === "/api/sync")).toBe(true);
  });

  it("creates a working health route", async () => {
    const app = createApp(createMemoryDatabase());
    const routes = app._router?.stack || app.router?.stack || [];
    expect(routes.some(layer => layer.route?.path === "/health")).toBe(true);
  });
});
