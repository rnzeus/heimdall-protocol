import { z } from "zod";

export const EventTypeSchema = z.enum(["network", "zustand"]);
export type EventType = z.infer<typeof EventTypeSchema>;
