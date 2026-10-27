import { z } from "zod";

export const ConsoleLevelSchema = z.enum(["log", "info", "warn", "error", "debug"]);
export type ConsoleLevel = z.infer<typeof ConsoleLevelSchema>;

export const ConsoleSourceSchema = z.enum([
  "console",
  "uncaught",
  "unhandled-rejection",
]);
export type ConsoleSource = z.infer<typeof ConsoleSourceSchema>;

export const ConsoleEventPayloadSchema = z.object({
  type: z.literal("console"),
  id: z.string(),
  ts: z.number(),
  level: ConsoleLevelSchema,
  source: ConsoleSourceSchema,
  message: z.string(),
  /** JSON snapshot of the arguments, size-limited by the SDK */
  args: z.string().optional(),
  stack: z.string().optional(),
  fatal: z.boolean().optional(),
  truncated: z.boolean().optional(),
});

export type ConsoleEventPayload = z.infer<typeof ConsoleEventPayloadSchema>;
