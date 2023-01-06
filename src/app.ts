import express from 'express'
import http from 'http'
import { Server } from 'socket.io'
import eventHandlers from './handlers'

const app = express()
const server = http.createServer(app)
const port = process.env.PORT || 3003

const io = new Server(server, {
  cors: {
    origin: true,
    methods: ['GET'],
  },
  transports: ['websocket', 'polling'],
})

const namespaces = [{ name: '/party-party', sendUpdates: true, updateTime: 500 }, { name: '/giveaway-o-tron' }]

const namespaceRoomStores: { [k: string]: any } = {}

function replacer(_key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    }
  } else if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value.values()),
    }
  } else {
    return value
  }
}

function createNamespacedLogger(ns: string) {
  const cleanNs = ns.slice(1)
  return {
    warn: function warn(...args: any) {
      console.warn(`[${cleanNs}]`, ...args)
    },
    error: function error(...args: any) {
      console.error(`[${cleanNs}]`, ...args)
    },
    info: function info(...args: any) {
      console.info(`[${cleanNs}]`, ...args)
    },
  }
}

for (const ns of namespaces) {
  const logger = createNamespacedLogger(ns.name)
  const handlers = eventHandlers[ns.name] || {}
  io.of(ns.name).on('connection', (socket) => {
    const channelRoom = socket.handshake.query?.room
    let store = namespaceRoomStores[`${ns.name}/${channelRoom}`]
    if (!store) {
      store = {}
      namespaceRoomStores[`${ns.name}/${channelRoom}`] = store
    }
    logger.info('[connection]', { ns: ns.name, channel: channelRoom })
    handlers.connection?.call(undefined, { socket, store, logger })
    if (channelRoom) {
      socket.join(`${channelRoom}`)
    }
    socket.on('event', async (msg: { type?: string }) => {
      if (handlers[msg?.type]) {
        handlers[msg?.type]?.call(undefined, { socket, store, logger })
      } else {
        logger.warn('[warn][missed-event]', { msg })
      }
    })
    socket.on('disconnect', () => {
      logger.info('[disconnect]')
      handlers.disconnect?.call(undefined, { socket, store, logger })
    })
  })

  if (ns.sendUpdates) {
    setInterval(() => {
      const rooms = [...io.of(ns.name).adapter.rooms.keys()]
      const sockets = [...io.of(ns.name).adapter.sids.keys()]
      const nonSocketRooms = rooms.filter((id) => !sockets.includes(id))
      for (const room of nonSocketRooms) {
        io.of(ns.name)
          .to(room)
          .emit('event', {
            type: 'update',
            data: JSON.stringify(namespaceRoomStores[`${ns.name}/${room}`], replacer),
          })
      }
    }, ns.updateTime)
  }
}

app.get('/', (_req, res) => {
  res.send(`<h1>${io.engine.clientsCount} client${io.engine.clientsCount === 1 ? '' : 's'}</h1>`)
})

server.listen(port, () => {
  console.log(`http://localhost:${port}`)
})
