import { z } from "zod";

export const HelloRejectReasonSchema = z.enum(["auth", "channel", "version"]);
export type HelloRejectReason = z.infer<typeof HelloRejectReasonSchema>;

/**
 * Host → SDK answer to `hello`, sent once per connection.
 *
 * Host messages are not strict on purpose: the host is released before the SDK, so an SDK
 * must accept a message from a newer host. Unknown fields are stripped, an unknown `reason`
 * parses as `undefined`.
 */
export const HelloAckWireMessageV1Schema = z.object({
  kind: z.literal("helloAck"),
  v: z.literal(1),
  status: z.enum(["accepted", "rejected"]),
  reason: HelloRejectReasonSchema.optional().catch(undefined),
  hostVersion: z.string().optional(),
});

export type HelloAckWireMessageV1 = z.infer<typeof HelloAckWireMessageV1Schema>;

/**
 * Host → SDK settings, sent after an accepted `hello` and on every change; the latest one wins.
 * A missing section means "off". Requests above the SDK's `hello.capabilities` are capped by the SDK.
 */
export const HostConfigFramesSchema = z.object({
  enabled: z.boolean(),
  fps: z.number().optional(),
  maxWidth: z.number().optional(),
});

export type HostConfigFrames = z.infer<typeof HostConfigFramesSchema>;

export const HostConfigWireMessageV1Schema = z.object({
  kind: z.literal("hostConfig"),
  v: z.literal(1),
  frames: HostConfigFramesSchema.optional(),
});

export type HostConfigWireMessageV1 = z.infer<typeof HostConfigWireMessageV1Schema>;

/**
 * Host → SDK: take a frame of the screen as it is now, for a bug report opened at this moment. Sent only to an
 * SDK that announced `capabilities.frames`; the frame comes back as a usual `screenFrame`, also while frames
 * are off — then as a one-off.
 */
export const CaptureScreenWireMessageV1Schema = z.object({
  kind: z.literal("captureScreen"),
  v: z.literal(1),
});

export type CaptureScreenWireMessageV1 = z.infer<typeof CaptureScreenWireMessageV1Schema>;

export const HostWireMessageV1Schema = z.discriminatedUnion("kind", [
  HelloAckWireMessageV1Schema,
  HostConfigWireMessageV1Schema,
  CaptureScreenWireMessageV1Schema,
]);

export type HostWireMessageV1 = z.infer<typeof HostWireMessageV1Schema>;

export const safeParseHostWireMessageV1 = (input: unknown) =>
  HostWireMessageV1Schema.safeParse(input);
