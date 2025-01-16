import { EventHandler } from '../../types'
import spotifyClient from './client'

const handlers: EventHandler<any> = {
  play: async ({ msg, logger }) => {
    try {
      const result = await spotifyClient.pause(msg)
      logger.info('play', { ok: result.ok })
    } catch (e) {
      logger.error('play', { error: e.message })
    }
  },
  pause: async ({ msg, logger }) => {
    try {
      const result = await spotifyClient.pause(msg)
      logger.info('pause', { ok: result.ok })
    } catch (e) {
      logger.error('pause', { error: e.message })
    }
  },
  next: async ({ msg, logger }) => {
    try {
      const result = await spotifyClient.next(msg)
      logger.info('next', { ok: result.ok })
    } catch (e) {
      logger.error('next', { error: e.message })
    }
  },
  previous: async ({ msg, logger }) => {
    try {
      const result = await spotifyClient.previous(msg)
      logger.info('previous', { ok: result.ok })
    } catch (e) {
      logger.error('previous', { error: e.message })
    }
  },
  info: async ({ logger }) => {
    try {
      const result = await spotifyClient.info()
      logger.info('info', { ok: result.ok })
    } catch (e) {
      logger.error('info', { error: e.message })
    }
  },
  playing: async ({ logger }) => {
    try {
      const result = await spotifyClient.playing()
      logger.info('playing', { ok: result.ok })
    } catch (e) {
      logger.error('playing', { error: e.message })
    }
  },
}

export default handlers
