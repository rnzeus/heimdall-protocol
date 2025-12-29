import { z } from "zod";

export const NetworkTransportSchema = z.enum(["xhr"]);
export type NetworkTransport = z.infer<typeof NetworkTransportSchema>;

export const NetworkEventPayloadSchema = z
  .object({
    id: z.string(),
    type: z.literal("network"),
    transport: NetworkTransportSchema,
    requestId: z.string(),
    tsStart: z.number(),
    tsEnd: z.number(),
    method: z.string(),
    url: z.string(),
    host: z.string(),
    path: z.string(),
    status: z.number().optional(),
    ok: z.boolean(),
    durationMs: z.number(),
    error: z.string().optional(),

    // request
    requestHeaders: z.record(z.string(), z.string()),
    requestBodySnippet: z.string().optional(),
    requestBodySnippetBytes: z.number().optional(),
    requestBodyTruncated: z.boolean().optional(),
    requestBodySize: z.number().optional(),
    requestContentType: z.string().optional(),

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
