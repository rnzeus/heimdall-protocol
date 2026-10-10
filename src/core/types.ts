import { z } from "zod";
import { NetworkEventPayloadSchema } from "../network";
import { ZustandEventPayloadSchema } from "../zustand";
import { WireMessageKindSchema } from "../shared";
import { WsEventPayloadSchema } from "../websocket";
import { ConsoleEventPayloadSchema } from "../console";

export const WireMessageBaseSchema = z
  .object({
    kind: WireMessageKindSchema,
    v: z.number(),
    channel: z.string(),
    clientId: z.string(),
    sessionId: z.string(),
    deviceName: z.string().optional(),
    platform: z.string().optional(),
    appId: z.string().optional(),
  })
  .strict();

export type WireMessageBase = z.infer<typeof WireMessageBaseSchema>;

/**
 * Hello wire message - sent once after TCP connect
 */
export const HelloAppInfoSchema = z
  .object({
    version: z.string().optional(),
    build: z.string().optional(),
    environment: z.string().optional(),
  })
  .strict();

export type HelloAppInfo = z.infer<typeof HelloAppInfoSchema>;

export const HelloDeviceInfoSchema = z
  .object({
    os: z.string().optional(),
    osVersion: z.string().optional(),
    model: z.string().optional(),
    manufacturer: z.string().optional(),
  })
  .strict();

export type HelloDeviceInfo = z.infer<typeof HelloDeviceInfoSchema>;

export const HelloWireMessageV1Schema = WireMessageBaseSchema.extend({
  kind: z.literal("hello"),
  v: z.literal(1),
  sdkVersion: z.string().optional(),
  app: HelloAppInfoSchema.optional(),
  device: HelloDeviceInfoSchema.optional(),
});

export type HelloWireMessageV1 = z.infer<typeof HelloWireMessageV1Schema>;

/**
 * Event wire payload
 */
export const EventWirePayloadSchema = z.union([
  NetworkEventPayloadSchema,
  ZustandEventPayloadSchema,
  WsEventPayloadSchema,
  ConsoleEventPayloadSchema,
]);

export type EventWirePayload = z.infer<typeof EventWirePayloadSchema>;

/**
 * Event wire message - sent
 */
export const EventWireMessageV1Schema = WireMessageBaseSchema.extend({
  kind: z.literal("event"),
  v: z.literal(1),
  event: EventWirePayloadSchema,
});

export type EventWireMessageV1 = z.infer<typeof EventWireMessageV1Schema>;

export const WireMessageV1Schema = z.union([
  HelloWireMessageV1Schema,
  EventWireMessageV1Schema,
]);

export type WireMessageV1 = z.infer<typeof WireMessageV1Schema>;

export const safeParseWireMessageV1 = (input: unknown) =>
  WireMessageV1Schema.safeParse(input);

/**
 * Loose envelope check: lets a host tell "message from a newer SDK" apart from garbage
 * when the full schema rejects it.
 */
export const WireEnvelopeSchema = z.looseObject({
  kind: z.string(),
  v: z.number(),
  channel: z.string(),
  clientId: z.string(),
  sessionId: z.string(),
});

export type WireEnvelope = z.infer<typeof WireEnvelopeSchema>;

export const safeParseWireEnvelope = (input: unknown) =>
  WireEnvelopeSchema.safeParse(input);
