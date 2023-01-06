import { EventHandler } from '../types'

const handlers: EventHandler<any> = {
  test: ({ logger }) => {
    logger.info('test')
  },
}

export default handlers
