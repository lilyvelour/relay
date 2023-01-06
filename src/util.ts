export function removeIdx<T>(ar: T[], idx: number): T[] {
  return ar.slice(0, idx).concat(ar.slice(idx + 1))
}

export const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export function getRandomArrayItem<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]
}

export function chunkArray<T>(arr: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize)
    chunks.push(chunk)
  }
  return chunks
}

export function replacer(_key: string, value: any) {
  if (value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()),
    }
  } else if (value instanceof Set) {
    return {
      dataType: 'Set',
      value: Array.from(value.values()),
    }
  } else {
    return value
  }
}

function reviver(_key: string, value: any) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value)
    } else if (value.dataType === 'Set') {
      return new Set(value.value)
    }
  }
  return value
}

export function safelyReviveJsonString(logger: any, str: string) {
  try {
    return JSON.parse(str, reviver)
  } catch (e) {
    logger.error(`Failed to revive string: ${str} (${e.message})`)
    return {}
  }
}
