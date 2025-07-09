# Giveaway Relay

For everything websocket related.

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
