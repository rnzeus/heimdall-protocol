import { z } from "zod";

export const WsEventPayloadSchema = z.object({
  id: z.string(),
  type: z.literal("ws"),
  transport: z.literal("websocket"),

  connectionId: z.string(),
  ts: z.number(),
  url: z.string(),

  // lifecycle OR frame
  kind: z.enum(["open", "close", "error", "frame"]),
  direction: z.enum(["in", "out"]).optional(),

  // frame data
  dataSnippet: z.string().optional(),
  dataSnippetBytes: z.number().optional(),
  dataTruncated: z.boolean().optional(),
  dataSize: z.number().optional(),
  dataContentType: z.string().optional(),

  // close/error
  code: z.number().optional(),
  reason: z.string().optional(),
  error: z.string().optional(),
});

export type WsEventPayload = z.infer<typeof WsEventPayloadSchema>;
