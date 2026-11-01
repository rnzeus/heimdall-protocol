import { describe, expect, it } from "vitest";
import { safeParseHostWireMessageV1 } from "./types";

describe("helloAck", () => {
  it("accepts an accepted ack", () => {
    const result = safeParseHostWireMessageV1({ kind: "helloAck", v: 1, status: "accepted", hostVersion: "0.4.0" });
    expect(result.data).toEqual({ kind: "helloAck", v: 1, status: "accepted", hostVersion: "0.4.0" });
  });

  it("accepts a rejected ack with a reason", () => {
    const result = safeParseHostWireMessageV1({ kind: "helloAck", v: 1, status: "rejected", reason: "auth" });
    expect(result.data).toEqual({ kind: "helloAck", v: 1, status: "rejected", reason: "auth" });
  });

  it("strips fields from a newer host", () => {
    const result = safeParseHostWireMessageV1({ kind: "helloAck", v: 1, status: "accepted", extra: 1 });
    expect(result.data).toEqual({ kind: "helloAck", v: 1, status: "accepted" });
  });

  it("drops a reason it does not know", () => {
    const result = safeParseHostWireMessageV1({ kind: "helloAck", v: 1, status: "rejected", reason: "busy" });
    expect(result.data).toEqual({ kind: "helloAck", v: 1, status: "rejected", reason: undefined });
  });

  it("rejects an unknown status", () => {
    expect(safeParseHostWireMessageV1({ kind: "helloAck", v: 1, status: "pending" }).success).toBe(false);
  });

  it("accepts a hostConfig with frames", () => {
    const config = { kind: "hostConfig", v: 1, frames: { enabled: true, fps: 1, maxWidth: 480 } };
    expect(safeParseHostWireMessageV1(config).data).toEqual(config);
  });

  it("accepts a hostConfig without sections and strips unknown ones", () => {
    expect(safeParseHostWireMessageV1({ kind: "hostConfig", v: 1, inspector: {} }).data).toEqual({
      kind: "hostConfig",
      v: 1,
    });
  });

  it("rejects frames without enabled", () => {
    expect(safeParseHostWireMessageV1({ kind: "hostConfig", v: 1, frames: { fps: 1 } }).success).toBe(false);
  });

  it("accepts captureScreen and strips fields from a newer host", () => {
    expect(safeParseHostWireMessageV1({ kind: "captureScreen", v: 1, quality: "high" }).data).toEqual({
      kind: "captureScreen",
      v: 1,
    });
  });

  it("rejects other kinds and versions", () => {
    expect(safeParseHostWireMessageV1({ kind: "hello", v: 1, status: "accepted" }).success).toBe(false);
    expect(safeParseHostWireMessageV1({ kind: "helloAck", v: 2, status: "accepted" }).success).toBe(false);
  });
});
