import { EventHandlers } from '../types'
import partyPartyHandlers from './party-party'
import giveawayotronHandlers from './giveaway-o-tron'
import spotifyHandlers from './spotify'
import patreonHeraldHandlers from './patreon-herald'

const eventHandlers: EventHandlers = {
  '/party-party': partyPartyHandlers,
  '/giveaway-o-tron': giveawayotronHandlers,
  '/spotify': spotifyHandlers,
  '/patreon-herald': patreonHeraldHandlers,
}

export default eventHandlers
