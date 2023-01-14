import { EventHandler } from '../../types'
import spotifyClient from './client'

const handlers: EventHandler<any> = {
  play: async ({ msg, logger }) => {
    const result = await spotifyClient.pause(msg)
    logger.info('play', { ok: result.ok })
  },
  pause: async ({ msg, logger }) => {
    const result = await spotifyClient.pause(msg)
    logger.info('pause', { ok: result.ok })
  },
  next: async ({ msg, logger }) => {
    const result = await spotifyClient.next(msg)
    logger.info('next', { ok: result.ok })
  },
  previous: async ({ msg, logger }) => {
    const result = await spotifyClient.previous(msg)
    logger.info('previous', { ok: result.ok })
  },
  info: async ({ logger }) => {
    const result = await spotifyClient.info()
    logger.info('info', { ok: result.ok })
  },
  playing: async ({ logger }) => {
    const result = await spotifyClient.playing()
    logger.info('playing', { ok: result.ok })
  },
}

export default handlers
