import { z } from "zod";

export const EventTypeSchema = z.enum(["network", "networkStart", "zustand", "ws", "console", "screenFrame", "framesStatus", "screenTap"]);
export type EventType = z.infer<typeof EventTypeSchema>;
