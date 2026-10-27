import { z } from "zod";

export const ZustandEventPayloadSchema = z.object({
  type: z.literal("zustand"),
  id: z.string(),
  store: z.string(),
  ts: z.number(),
  state: z.unknown(),
  prevState: z.unknown().optional(),
  action: z.string().optional(),
});

export type ZustandEventPayload = z.infer<typeof ZustandEventPayloadSchema>;
