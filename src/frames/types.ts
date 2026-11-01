import { z } from "zod";

/**
 * How a frame was taken: `system` — the screen as the device composes it, what the tester sees (Android
 * PixelCopy, iOS ReplayKit); `snapshot` — the app's views drawn by the SDK, where forms, video and maps
 * may come out blank (iOS without screen recording). An unknown value parses as `undefined`.
 */
export const FrameSourceSchema = z.enum(["system", "snapshot"]);
export type FrameSource = z.infer<typeof FrameSourceSchema>;

/**
 * One screenshot of the app window, sent while the host asks for frames (`hostConfig.frames`) or once on
 * `captureScreen`. The SDK skips frames identical to the previous one, so the gap between two frames can be long.
 */
export const ScreenFrameEventPayloadSchema = z.object({
  type: z.literal("screenFrame"),
  id: z.string(),
  ts: z.number(),
  width: z.number(),
  height: z.number(),
  mime: z.enum(["image/jpeg"]),
  /** base64 */
  data: z.string(),
  source: FrameSourceSchema.optional().catch(undefined),
});

export type ScreenFrameEventPayload = z.infer<typeof ScreenFrameEventPayloadSchema>;

export const ScreenTapKindSchema = z.enum(["tap", "longPress"]);
export type ScreenTapKind = z.infer<typeof ScreenTapKindSchema>;

/**
 * A tap on the screen while frames are captured — a finger down and up without moving; scrolls are not sent.
 * Where it went down, in shares of the captured area (0…1 from the top left), so it lands on the frame whatever
 * its size. `ts` is when it went down, on the device clock like frames. An unknown kind parses as `undefined`.
 */
export const ScreenTapEventPayloadSchema = z.object({
  type: z.literal("screenTap"),
  id: z.string(),
  ts: z.number(),
  x: z.number(),
  y: z.number(),
  kind: ScreenTapKindSchema.optional().catch(undefined),
});

export type ScreenTapEventPayload = z.infer<typeof ScreenTapEventPayloadSchema>;

export const FramesStateSchema = z.enum(["running", "paused"]);
export type FramesState = z.infer<typeof FramesStateSchema>;

/**
 * `recording_declined` — the tester declined the system's screen recording prompt (iOS asks again only after
 * the app restarts); `recording_off` — the tester turned screen recording off on the device.
 */
export const FramesPauseReasonSchema = z.enum([
  "slow_device",
  "background",
  "recording_declined",
  "recording_off",
]);
export type FramesPauseReason = z.infer<typeof FramesPauseReasonSchema>;

export const FramesDeviceClassSchema = z.enum(["low", "normal"]);
export type FramesDeviceClass = z.infer<typeof FramesDeviceClassSchema>;

/**
 * Sent when capture starts, stops, pauses or changes its rate. Unknown reasons and device classes
 * parse as `undefined`, so a newer SDK can add them.
 */
export const FramesStatusEventPayloadSchema = z.object({
  type: z.literal("framesStatus"),
  id: z.string(),
  ts: z.number(),
  state: FramesStateSchema,
  reason: FramesPauseReasonSchema.optional().catch(undefined),
  /** current rate, lowered by the SDK on a slow device */
  fps: z.number(),
  deviceClass: FramesDeviceClassSchema.optional().catch(undefined),
  /** how frames are taken now */
  source: FrameSourceSchema.optional().catch(undefined),
});

export type FramesStatusEventPayload = z.infer<typeof FramesStatusEventPayloadSchema>;

/** What the SDK can capture; the host never asks for more. */
export const FramesCapabilitySchema = z.object({
  maxFps: z.number(),
  maxWidth: z.number(),
});

export type FramesCapability = z.infer<typeof FramesCapabilitySchema>;
