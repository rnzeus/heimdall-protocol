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

export const HostWireMessageV1Schema = z.discriminatedUnion("kind", [HelloAckWireMessageV1Schema]);

export type HostWireMessageV1 = z.infer<typeof HostWireMessageV1Schema>;

export const safeParseHostWireMessageV1 = (input: unknown) =>
  HostWireMessageV1Schema.safeParse(input);
