import { z } from "zod";
import { NetworkEventPayloadSchema } from "../network";
import { ZustandEventPayloadSchema } from "../zustand";
import { WireMessageKindSchema } from "../shared";

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
export const HelloWireMessageV1Schema = WireMessageBaseSchema.extend({
  kind: z.literal("hello"),
  v: z.literal(1),
});

export type HelloWireMessageV1 = z.infer<typeof HelloWireMessageV1Schema>;

/**
 * Event wire payload
 */
export const EventWirePayloadSchema = z.union([
  NetworkEventPayloadSchema,
  ZustandEventPayloadSchema,
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
