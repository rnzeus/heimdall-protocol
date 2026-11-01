import { describe, expect, it } from "vitest";
import { safeParseWireMessageV1 } from "../core";

const envelope = {
  kind: "event",
  v: 1,
  channel: "heimdall://local-abc123",
  clientId: "client",
  sessionId: "session",
};

const frame = {
  type: "screenFrame",
  id: "f1",
  ts: 1,
  width: 480,
  height: 1040,
  mime: "image/jpeg",
  data: "/9j/4AAQ",
};

const status = { type: "framesStatus", id: "s1", ts: 1, state: "paused", reason: "slow_device", fps: 0.25 };

describe("screenFrame", () => {
  it("accepts a frame", () => {
    expect(safeParseWireMessageV1({ ...envelope, event: frame }).data).toEqual({ ...envelope, event: frame });
  });

  it("rejects an unknown image type", () => {
    expect(safeParseWireMessageV1({ ...envelope, event: { ...frame, mime: "image/webp" } }).success).toBe(false);
  });

  it("rejects a frame without data", () => {
    const { data: _data, ...withoutData } = frame;
    expect(safeParseWireMessageV1({ ...envelope, event: withoutData }).success).toBe(false);
  });
});

describe("framesStatus", () => {
  it("accepts a status", () => {
    expect(safeParseWireMessageV1({ ...envelope, event: status }).data).toEqual({ ...envelope, event: status });
  });

  it("drops a reason and a device class it does not know", () => {
    const result = safeParseWireMessageV1({ ...envelope, event: { ...status, reason: "thermal", deviceClass: "tv" } });
    expect(result.data).toEqual({ ...envelope, event: { ...status, reason: undefined, deviceClass: undefined } });
  });

  it("rejects an unknown state", () => {
    expect(safeParseWireMessageV1({ ...envelope, event: { ...status, state: "stopped" } }).success).toBe(false);
  });
});
