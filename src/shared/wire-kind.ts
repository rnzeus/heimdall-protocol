import { z } from "zod";

export const WireMessageKindSchema = z.enum(["hello", "event"]);
export type WireMessageKind = z.infer<typeof WireMessageKindSchema>;
