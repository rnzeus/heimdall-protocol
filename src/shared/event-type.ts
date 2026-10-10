import { z } from "zod";

export const EventTypeSchema = z.enum(["network", "zustand", "ws", "console"]);
export type EventType = z.infer<typeof EventTypeSchema>;
