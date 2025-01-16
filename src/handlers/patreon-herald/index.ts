import { EventHandler } from '../../types'

const patreonHeraldHandlers: EventHandler<unknown> = {
  announce: ({ socket, logger, msg }) => {
    logger.info('Announce', { msg })
    socket.to(`${msg.campaignId}`).emit('event', msg)
  },
}

export default patreonHeraldHandlers
