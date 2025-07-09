import { EventHandlers } from '../types'
import giveawayotronHandlers from './giveaway-o-tron'

const eventHandlers: EventHandlers = {
  '/giveaway-o-tron': giveawayotronHandlers,
}

export default eventHandlers
