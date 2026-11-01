import { z } from "zod";

export const EventTypeSchema = z.enum(["network", "networkStart", "zustand", "ws", "console", "screenFrame", "framesStatus"]);
export type EventType = z.infer<typeof EventTypeSchema>;
