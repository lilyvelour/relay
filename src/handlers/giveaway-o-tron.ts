import { EventHandler } from '../types'

const handlers: EventHandler<any> = {
  test: ({ logger, room, msg }) => {
    logger.info('test', { room, msg })
  },
}

export default handlers
