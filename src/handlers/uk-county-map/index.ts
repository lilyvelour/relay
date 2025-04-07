import { EventHandler } from '../../types'

const ukCountyMapHandlers: EventHandler<unknown> = {
  update: ({ socket, logger, msg }) => {
    logger.info('Update', { msg })
    // Don't emit to self
    socket.broadcast.emit('event', msg)
  },
}

export default ukCountyMapHandlers
