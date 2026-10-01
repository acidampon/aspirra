import { describe, it, expect } from "vitest";
import { syncRequestSchema } from "./schemas.js";

const envelope = {
  formatVersion: 1,
  schemaVersion: 6,
  revision: 1,
  deviceId: "device-a",
  updatedAt: "2026-10-01T00:00:00.000Z",
  account: { mode: "cloud", userId: "u1" },
  state: { goals: [] }
};

describe("sync request contract", () => {
  it("accepts a valid envelope", () => {
    expect(syncRequestSchema.safeParse({ envelope }).success).toBe(true);
  });
  it("rejects unsupported envelope format", () => {
    expect(syncRequestSchema.safeParse({ envelope: { ...envelope, formatVersion: 2 } }).success).toBe(false);
  });
  it("rejects negative revisions", () => {
    expect(syncRequestSchema.safeParse({ envelope: { ...envelope, revision: -1 } }).success).toBe(false);
  });
  it("rejects missing account identity", () => {
    expect(syncRequestSchema.safeParse({ envelope: { ...envelope, account: { mode: "cloud", userId: "" } } }).success).toBe(false);
  });
});
