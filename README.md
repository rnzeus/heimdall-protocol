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

An `event` carries one of four payloads:

| Payload | Schema |
|---|---|
| Network request | `NetworkEventPayloadSchema` |
| WebSocket | `WsEventPayloadSchema` |
| Zustand snapshot | `ZustandEventPayloadSchema` |
| Console | `ConsoleEventPayloadSchema` |

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
- Schemas are strict: a message with an unknown field is rejected.
- Changes are additive only. A new field is released in the protocol first, then in the host, then in the SDK.

## License

MIT
