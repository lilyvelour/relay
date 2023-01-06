<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="./.imgs/dark.png">
    <source media="(prefers-color-scheme: light)" srcset="./.imgs/light.png">
    <img height="100" width="100" src="./.imgs/light.png">
  </picture>
</p>
<h1 align="center">Relay</h1>

For everything websocket related.

## Current Handlers

- [Giveaway-o-tron](https://github.com/maael/giveaway-o-tron)
  - Actually used by others ([Mukluk](https://www.twitch.tv/mukluk))
- [Party-Party](https://github.com/maael/party-party)
  - Fun side project

## Features

- Isolated handlers based on [Socket.IO namespacing](https://socket.io/docs/v4/namespaces/)
  - Namespaced logging/loggers
- Easy isolated rooms via adding `room` query
  - Each room receives its own global shared "state" object that is shared across sockets
  - Configurable recurring pushes to clients of global shared state
- Handles passing Maps and Sets back (though they will need to be re-hydrated by consumers)

## Reasoning

So I can try to have one server handling all websocket things, with some basic features I generally want, and to reduce costs, while also keeping the services isolated.

## Usage

### Client usage

#### Socket Setup

```ts
const socket = io(`${process.env.NEXT_PUBLIC_RELAY_URI}/${process.env.NEXT_PUBLIC_RELAY_NS}`, {
  query: { room, ...etc },
  transports: ['websocket', 'polling'],
})
```

#### Sending events

Relay works by using the namespace and `type` field in the received `event` events to direct to the correct function. The goal is define the available event types via config.

```ts
socket.emit('event', { type: 'handlerFunction', ...data })
```

#### Handling events

```ts
socket.on('event', (e) => {
  console.info('[event]', e)
  try {
    const data = JSON.parse(e.data, reviver)
    console.info({ data })
    if (e.type === 'update') {
      setData(data)
    }
  } catch (e) {
    console.error('error', e)
  }
})
```

##### Map/Set in socket data

If returning Maps/Sets in data to sockets, you will need to `JSON.parse(data, reviver)` with the below function.

```ts
function reviver(_key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value)
    } else if (value.dataType === 'Set') {
      return new Set(value.value)
    }
  }
  return value
}
```
