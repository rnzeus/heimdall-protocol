import { describe, expect, it } from "vitest";
import { safeParseWireEnvelope, safeParseWireMessageV1 } from "./types";

const hello = {
  kind: "hello",
  v: 1,
  channel: "heimdall://local-abc123",
  clientId: "client",
  sessionId: "session",
  sdkVersion: "0.3.0",
};

describe("hello", () => {
  it("accepts a hello without auth", () => {
    expect(safeParseWireMessageV1(hello).success).toBe(true);
  });

  it("accepts a hello with auth", () => {
    const result = safeParseWireMessageV1({ ...hello, auth: { token: "secret" } });
    expect(result.success).toBe(true);
    expect(result.data).toMatchObject({ auth: { token: "secret" } });
  });

  it("rejects auth without a token", () => {
    expect(safeParseWireMessageV1({ ...hello, auth: {} }).success).toBe(false);
  });

  it("rejects unknown fields in auth", () => {
    const result = safeParseWireMessageV1({ ...hello, auth: { token: "secret", extra: 1 } });
    expect(result.success).toBe(false);
  });

  it("rejects unknown top-level fields", () => {
    expect(safeParseWireMessageV1({ ...hello, extra: 1 }).success).toBe(false);
  });

  it("rejects other wire versions", () => {
    expect(safeParseWireMessageV1({ ...hello, v: 2 }).success).toBe(false);
  });
});

describe("envelope", () => {
  it("accepts a message the full schema rejects", () => {
    const message = { ...hello, extra: 1 };
    expect(safeParseWireMessageV1(message).success).toBe(false);
    expect(safeParseWireEnvelope(message).success).toBe(true);
  });
});

describe("network start", () => {
  const start = {
    id: "e1",
    type: "networkStart",
    transport: "xhr",
    requestId: "r1",
    tsStart: 1000,
    method: "POST",
    url: "https://api.example.com/cart",
    host: "api.example.com",
    path: "/cart",
    requestHeaders: { "content-type": "application/json" },
  };
  const message = (event: object) => ({
    kind: "event",
    v: 1,
    channel: hello.channel,
    clientId: hello.clientId,
    sessionId: hello.sessionId,
    event,
  });

  it("accepts the start of a request", () => {
    expect(safeParseWireMessageV1(message(start)).success).toBe(true);
  });

  it("rejects fields that only a completed request has", () => {
    expect(safeParseWireMessageV1(message({ ...start, status: 200 })).success).toBe(false);
  });

  it("keeps accepting the completion with the same requestId", () => {
    const completed = {
      ...start,
      id: "e2",
      type: "network",
      tsEnd: 1200,
      status: 200,
      ok: true,
      durationMs: 200,
      responseHeaders: {},
    };
    expect(safeParseWireMessageV1(message(completed)).success).toBe(true);
  });
});
