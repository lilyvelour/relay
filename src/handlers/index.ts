import partyPartyHandlers from './party-party'
import giveawayotronHandlers from './giveaway-o-tron'
import { EventHandlers } from '../types'

const eventHandlers: EventHandlers = {
  '/party-party': partyPartyHandlers,
  '/giveaway-o-tron': giveawayotronHandlers,
}

export default eventHandlers
