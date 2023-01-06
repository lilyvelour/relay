import type { Socket } from 'socket.io'

export type EventHandlers = {
  [k: string]: EventHandler<any>
}

export type EventHandler<Store> = {
  [k: string]: ({
    socket,
    msg,
    store,
  }: {
    socket: Socket
    msg?: any
    store: Partial<Store>
    logger: {
      info: typeof console.info
      warn: typeof console.warn
      error: typeof console.error
    }
  }) => void
}
