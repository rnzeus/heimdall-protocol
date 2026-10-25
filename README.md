# Heimdall Protocol

Wire protocol of **Heimdall** — a desktop debug inspector for React Native apps. This package holds the [Zod](https://zod.dev) schemas and TypeScript types of the messages that [`@rnzeus/heimdall-sdk`](https://www.npmjs.com/package/@rnzeus/heimdall-sdk) sends to the Heimdall desktop app.

You only need it directly if you are building your own client or host. Apps install the SDK, which already depends on it.

## Install

```sh
yarn add @rnzeus/heimdall-protocol
```

## Messages

Every message is one JSON object. There are two kinds:

| Kind | When | Schema |
|---|---|---|
| `hello` | once, right after the connection is open | `HelloWireMessageV1Schema` |
| `event` | for every captured event | `EventWireMessageV1Schema` |

`hello` may carry `auth: { token }` — session credentials the SDK got from the cloud along with the host certificate. Only a host that issued them receives this field.

The host answers `hello` with one message:

| Kind | When | Schema |
|---|---|---|
| `helloAck` | once, after `hello`; `status` is `accepted` or `rejected` (`reason`: `auth`, `channel`, `version`) | `HelloAckWireMessageV1Schema` |

Parse host messages with `safeParseHostWireMessageV1`.

An `event` carries one of five payloads:

| Payload | Schema |
|---|---|
| Network request sent | `NetworkStartEventPayloadSchema` |
| Network request completed, failed or aborted | `NetworkEventPayloadSchema` |
| WebSocket | `WsEventPayloadSchema` |
| Zustand snapshot | `ZustandEventPayloadSchema` |
| Console | `ConsoleEventPayloadSchema` |

A request produces `networkStart` when it is sent and `network` when it ends; both carry the same `requestId`. A `networkStart` without a `network` means the request is still waiting for a response.

## Usage

```ts
import { safeParseWireMessageV1, type WireMessageV1 } from "@rnzeus/heimdall-protocol";

const result = safeParseWireMessageV1(JSON.parse(line));

if (result.success) {
  const message: WireMessageV1 = result.data;
}
```

`safeParseWireEnvelope` is a loose check of the common fields. A host uses it to tell a message from a newer SDK apart from garbage when the full schema rejects it.

## Compatibility

- The protocol version is the `v` field, currently `1`.
- SDK → host schemas are strict: a message with an unknown field is rejected.
- Host → SDK schemas are tolerant: unknown fields are stripped, so an SDK accepts messages from a newer host.
- Changes are additive only. A new field is released in the protocol first, then in the host, then in the SDK.

## License

MIT
