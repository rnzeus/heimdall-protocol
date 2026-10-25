import { z } from "zod";

export const NetworkTransportSchema = z.enum(["xhr"]);
export type NetworkTransport = z.infer<typeof NetworkTransportSchema>;

/** What is known about a request once it is sent; shared by its start and its completion. */
const requestShape = {
  id: z.string(),
  transport: NetworkTransportSchema,
  /** the same for the start and the completion of one request */
  requestId: z.string(),
  tsStart: z.number(),
  method: z.string(),
  url: z.string(),
  host: z.string(),
  path: z.string(),
  requestHeaders: z.record(z.string(), z.string()),
  requestContentType: z.string().optional(),
};

/** A request was sent; `network` with the same `requestId` follows once it completes, fails or is aborted. */
export const NetworkStartEventPayloadSchema = z
  .object({
    ...requestShape,
    type: z.literal("networkStart"),
  })
  .strict();

export type NetworkStartEventPayload = z.infer<typeof NetworkStartEventPayloadSchema>;

export const NetworkEventPayloadSchema = z
  .object({
    ...requestShape,
    type: z.literal("network"),
    tsEnd: z.number(),
    status: z.number().optional(),
    ok: z.boolean(),
    durationMs: z.number(),
    error: z.string().optional(),

    // request
    requestBodySnippet: z.string().optional(),
    requestBodySnippetBytes: z.number().optional(),
    requestBodyTruncated: z.boolean().optional(),
    requestBodySize: z.number().optional(),

    // response
    responseHeaders: z.record(z.string(), z.string()),
    responseBodySnippet: z.string().optional(),
    responseBodySnippetBytes: z.number().optional(),
    responseBodyTruncated: z.boolean().optional(),
    responseBodySize: z.number().optional(),
    responseContentType: z.string().optional(),
  })
  .strict();

export type NetworkEventPayload = z.infer<typeof NetworkEventPayloadSchema>;

export const NetworkFiltersSchema = z
  .object({
    allowedHosts: z
      .array(z.union([z.string(), z.instanceof(RegExp)]))
      .optional(),
    ignoreUrls: z.array(z.union([z.string(), z.instanceof(RegExp)])).optional(),
  })
  .strict();

export type NetworkFilters = z.infer<typeof NetworkFiltersSchema>;
