import { sendMessage } from './discord'
import { EventHandler } from '../../types'

const handlers: EventHandler<any> = {
  any: ({ socket, msg, logger }) => {
    if (msg.channelId) {
      logger.info('Re-emit', { channelId: msg.channelId, login: msg.login, type: msg.type })
      socket.to(`${msg.channelId}`).emit('event', msg)
    }
  },
  winner: async ({ logger, msg }) => {
    if (guardDiscordData(logger, msg)) return

    const { colour, link } = getDiscordSettings(msg)
    await sendMessage(msg.discordGuildId, msg.discordChannelId, {
      colour,
      title: msg.discordTitle || 'A new giveaway winner!',
      link,
      body: msg.discordBody || `:tada: $winner won a giveaway! [Join the stream here]($link)`,
      winner: msg.winner,
      giveawayName: msg.giveawayName,
    })
  },
  'timer-start': async ({ logger, msg }) => {
    if (guardDiscordData(logger, msg)) return

    const { colour, link } = getDiscordSettings(msg)
    await sendMessage(msg.discordGuildId, msg.discordChannelId, {
      colour,
      title: msg.discordTitle || 'A giveaway has opened!',
      link,
      body: msg.discordBody || '[Join the stream now]($link)',
    })
  },
  'timer-end': async ({ logger, msg }) => {
    if (guardDiscordData(logger, msg)) return

    const { colour, link } = getDiscordSettings(msg)
    await sendMessage(msg.discordGuildId, msg.discordChannelId, {
      colour,
      title: msg.discordTitle || 'A giveaway has closed!',
      link,
      body: msg.discordBody || '[Join the stream now]($link)',
    })
  },
  'timer-cancel': async ({ logger, msg }) => {
    if (guardDiscordData(logger, msg)) return

    const { colour, link } = getDiscordSettings(msg)
    await sendMessage(msg.discordGuildId, msg.discordChannelId, {
      colour,
      title: msg.discordTitle || 'A giveaway was cancelled!',
      link,
      body: msg.discordBody || '[Join the stream now]($link)',
    })
  },
}

function guardDiscordData(logger: any, msg: any) {
  const isMissing = !msg.discordGuildId || !msg.discordChannelId || !msg.discordEnabled
  if (isMissing) {
    logger.warn('[discord]', 'Missing data or not enabled', {
      guildId: msg.discordGuildId,
      channelId: msg.discordChannelId,
      enabled: msg.discordEnabled,
    })
  }
  return isMissing
}

function getDiscordSettings(msg: any) {
  const link = `https://twitch.tv/${msg.login}`
  const colour = msg.discordColour || 0x9333ea
  return { link, colour }
}

export default handlers
