## `@rnzeus/heimdall-protocol`

Shared TypeScript wire-protocol types for communication between
**Heimdall SDK** and the **Heimdall Desktop App**.

This package contains the _contract_ used over TCP/WebSocket during
runtime:

- hello handshake message
- event messages
- typed payloads (network, zustand, etc.)
- versioned wire format (`v: 1`)

It includes **no runtime logic**, only types and interfaces.

---

## 📦 Installation

```bash
# npm
npm install @rnzeus/heimdall-protocol

# yarn
yarn add @rnzeus/heimdall-protocol
```

During development you may link the package locally:

```json
{
  "dependencies": {
    "@rnzeus/heimdall-protocol": "file:../heimdall-protocol"
  }
}
```

Make sure to build the package before using it:

```bash
npm run build
```

---

## 🔧 Usage

```ts
import type {
  HelloWireMessageV1,
  EventWireMessageV1,
  NetworkEventPayload,
  ZustandEventPayload,
} from "@rnzeus/heimdall-protocol";
```

SDK emits:

```ts
const msg: EventWireMessageV1 = {
  kind: "event",
  v: 1,
  channel: "default",
  clientId: "123",
  sessionId: "abc",
  event: {
    type: "network",
    transport: "fetch",
    method: "GET",
    url: "https://example.com",
    // ...
  },
};
```

Heimdall parses it based on the `v` field.

---

## 🧩 Protocol Versioning

This package uses **two versioning layers**:

### 1. Wire protocol version (`v`)

Changes only when the message format becomes incompatible.
Example: adding a required field → `v: 2`.

### 2. npm package version (`package.json`)

Follows semantic versioning:

- patch --- type-only changes
- minor --- new optional fields
- major --- breaking protocol changes (together with new `v`)

---

## 📂 Structure

    src/
      wire/
      network/
      zustand/
    dist/

---

## 📜 License

MIT --- see [LICENSE](./LICENSE).
