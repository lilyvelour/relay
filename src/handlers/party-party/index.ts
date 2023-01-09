import { getRandomArrayItem } from '../../util'
import { EventHandler } from '../../types'

interface BaseStore<State> {
  players: Map<String, { id: string; name: string; color: string; emoji: string; points: number }>
  lastTransition?: String
  state: State
}

interface ReadyCheckStore extends BaseStore<'ready-check'> {
  players: Map<String, { id: string; name: string; color: string; emoji: string; points: number }>
  local: {
    ready: string[]
  }
}

interface PlayingStore extends BaseStore<'playing'> {
  players: Map<String, { id: string; name: string; color: string; emoji: string; points: number }>
  local: {
    count: { [k: string]: number }
  }
}

interface FinishedStore extends BaseStore<'finished'> {
  players: Map<String, { id: string; name: string; color: string; emoji: string; points: number }>
  local: {}
}

const transitions = {
  'ready-check': 'playing',
  playing: 'finished',
  finished: 'ready-check',
}

// prettier-ignore
const colours = ['#e11d48', '#db2777', '#c026d3', '#9333ea', '#7c3aed', '#4f46e5', '#2563eb', '#0369a1', '#0e7490', '#0d9488', '#059669', '#16a34a'];
// prettier-ignore
const emojis = [
  [ "👹", "👺", "🤡", "👻", "💀", "👽", "👾", "🤖", "🎃", "👲", "👳‍♀️", "👳", "👳‍♂️", "🧕", ],
  [ "👮‍♀️", "👮", "👮‍♂️", "👷‍♀️", "👷", "👷‍♂️", "💂‍♀️", "💂", "💂‍♂️", "🕵️‍♀️", "🕵️", "🕵️‍♂️", "👩‍⚕️", "👨‍⚕️", "👩‍🌾", ],
  [ "👨‍🌾", "👩‍🍳", "👨‍🍳", "👩‍🎓", "👨‍🎓", "👩‍🎤", "👨‍🎤", "👩‍🏫", "👨‍🏫", "👩‍🏭", "👨‍🏭", "👩‍💻", "👨‍💻", "👩‍💼", "👨‍💼", ],
  [ "👩‍🔧", "👨‍🔧", "👩‍🔬", "👨‍🔬", "👩‍🎨", "👨‍🎨", "👩‍🚒", "👨‍🚒", "👩‍✈️", "👨‍✈️", "👩‍🚀", "👨‍🚀", "👩‍⚖️", "👨‍⚖️", "👰", ],
  [ "🤵", "👸", "🤴", "🦸‍♀️", "🦸", "🦸‍♂️", "🦹‍♀️", "🦹", "🦹‍♂️", "🤶", "🎅", "🧙‍♀️", "🧙", "🧙‍♂️", "🧝‍♀️", ],
  [ "🧝", "🧝‍♂️", "🧛‍♀️", "🧛", "🧛‍♂️", "🧟‍♀️", "🧟", "🧟‍♂️", "🧞‍♀️", "🧞", "🧞‍♂️", "🧜‍♀️", "🧜", "🧜‍♂️", "🧚‍♀️", ],
  [ "🧚", "🧚‍♂️"],
].flat();

const defaultState = 'ready-check'

const partyPartyHandlers: EventHandler<ReadyCheckStore | PlayingStore | FinishedStore> = {
  connection: ({ socket, store, logger }) => {
    logger.info('Connected', store)
    store.state = store.state || defaultState
    store.players = store.players || new Map()
    store.local = store.local || {}
    if (socket.handshake.query?.type === 'player') {
      store.players.set(socket.id, {
        id: socket.id,
        name: `${socket.handshake.query?.username || 'Unknown'}`,
        color: getRandomArrayItem(colours),
        emoji: getRandomArrayItem(emojis),
        points: 0,
      })
    }
  },
  ready: ({ socket, store, logger }) => {
    if (store.state === 'ready-check') {
      const ready = store.local.ready || []
      logger.info('ready', { ready, id: socket.id })
      if (ready.includes(socket.id)) {
        logger.info('pre', store.local.ready, socket.id)
        store.local.ready = ready.filter((i) => i !== socket.id)
        logger.info('post', store.local.ready)
      } else {
        store.local.ready = ready.concat(socket.id)
      }
    }
  },
  count: ({ socket, store }) => {
    if (store.state === 'playing') {
      store.local.count = store.local.count || {}
      store.local.count[socket.id] = (store.local.count[socket.id] || 0) + 1
    }
  },
  voteCheck: ({ socket, msg, store, logger }) => {
    logger.info('vote check')
  },
  transition: ({ socket, store, logger }) => {
    logger.info('transition', socket.id, store)
    store.state = transitions[store.state] || (defaultState as any)
    store.lastTransition = new Date().toISOString()
    store.local = {}
  },
  disconnect: ({ socket, store, logger }) => {
    logger.info('Disconnected', store)
    store.players?.delete(socket.id)
    if (store.players?.size === 0) {
      logger.info('Reset')
      store.state = defaultState
      store.players = store.players || new Map()
      ;(store as any).local = {}
    }
  },
}

export default partyPartyHandlers
