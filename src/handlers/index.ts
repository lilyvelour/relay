import partyPartyHandlers from './party-party'
import giveawayotronHandlers from './giveaway-o-tron'
import spotifyHandlers from './spotify'
import { EventHandlers } from '../types'

const eventHandlers: EventHandlers = {
  '/party-party': partyPartyHandlers,
  '/giveaway-o-tron': giveawayotronHandlers,
  '/spotify': spotifyHandlers,
}

export default eventHandlers
