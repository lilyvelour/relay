import { EventHandler } from '../../types'
import spotifyClient from './client'

const handlers: EventHandler<any> = {
  play: async ({ msg, logger }) => {
    const result = await spotifyClient.pause(msg)
    logger.info('play', result)
  },
  pause: async ({ msg, logger }) => {
    const result = await spotifyClient.pause(msg)
    logger.info('pause', result)
  },
  next: async ({ msg, logger }) => {
    const result = await spotifyClient.next(msg)
    logger.info('next', result)
  },
  previous: async ({ msg, logger }) => {
    const result = await spotifyClient.previous(msg)
    logger.info('previous', result)
  },
  info: async ({ logger }) => {
    const result = await spotifyClient.info()
    logger.info('info', result)
  },
  playing: async ({ logger }) => {
    const result = await spotifyClient.playing()
    logger.info('playing', result)
  },
}

export default handlers
