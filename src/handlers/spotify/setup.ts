import spotifyClient from './client'
import { wait } from '../../util'

export default function setup(namespace: any, store: any) {
  void updateStoreLoop(namespace.name, store)
}

async function updateStoreLoop(ns: string, store: any): Promise<void> {
  while (true) {
    await updateStore(ns, store)
    const waitTime = store[`${ns}/default`].isPlaying ? 1_000 : 10_000
    await wait(waitTime)
  }
}

async function updateStore(ns: string, store: any) {
  return Promise.race([
    (async () => {
      try {
        const playingInfo = await spotifyClient.playing()
        store[`${ns}/default`] = {
          ...playingInfo,
          updatedAt: new Date().toISOString(),
        }
      } catch (e) {
        console.error('[spotify][setup][error]', e)
      }
    })(),
    wait(5_000),
  ])
}
