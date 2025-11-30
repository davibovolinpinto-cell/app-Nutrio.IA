// Sistema robusto de persistência com sincronização entre abas

const STORAGE_PREFIX = 'fitapp_'

export const STORAGE_KEYS = {
  USER_PROFILE: `${STORAGE_PREFIX}user_profile`,
  USER_SUBSCRIPTION: `${STORAGE_PREFIX}user_subscription`,
  MEALS: `${STORAGE_PREFIX}meals`,
  HABITS: `${STORAGE_PREFIX}habits`,
  WORKOUTS: `${STORAGE_PREFIX}workouts`,
  PROGRESS: `${STORAGE_PREFIX}progress`,
  AUTH_TOKEN: `${STORAGE_PREFIX}auth_token`,
  LAST_SYNC: `${STORAGE_PREFIX}last_sync`,
} as const

// Debounce para evitar salvamentos excessivos
let saveTimeouts: Record<string, NodeJS.Timeout> = {}

export const storage = {
  // Salvar com debounce
  set: <T>(key: string, value: T, debounceMs: number = 300): void => {
    if (typeof window === 'undefined') return

    // Limpar timeout anterior
    if (saveTimeouts[key]) {
      clearTimeout(saveTimeouts[key])
    }

    // Criar novo timeout
    saveTimeouts[key] = setTimeout(() => {
      try {
        const serialized = JSON.stringify(value)
        localStorage.setItem(key, serialized)
        
        // Disparar evento customizado para sincronização entre abas
        window.dispatchEvent(
          new CustomEvent('storage-update', {
            detail: { key, value },
          })
        )
      } catch (error) {
        console.error(`Erro ao salvar ${key}:`, error)
      }
    }, debounceMs)
  },

  // Salvar imediatamente (sem debounce)
  setImmediate: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return

    try {
      const serialized = JSON.stringify(value)
      localStorage.setItem(key, serialized)
      
      // Disparar evento customizado
      window.dispatchEvent(
        new CustomEvent('storage-update', {
          detail: { key, value },
        })
      )
    } catch (error) {
      console.error(`Erro ao salvar ${key}:`, error)
    }
  },

  // Recuperar dados
  get: <T>(key: string, defaultValue?: T): T | null => {
    if (typeof window === 'undefined') return defaultValue || null

    try {
      const item = localStorage.getItem(key)
      if (item === null) return defaultValue || null
      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Erro ao carregar ${key}:`, error)
      return defaultValue || null
    }
  },

  // Remover item
  remove: (key: string): void => {
    if (typeof window === 'undefined') return

    try {
      localStorage.removeItem(key)
      
      // Disparar evento customizado
      window.dispatchEvent(
        new CustomEvent('storage-update', {
          detail: { key, value: null },
        })
      )
    } catch (error) {
      console.error(`Erro ao remover ${key}:`, error)
    }
  },

  // Limpar tudo
  clear: (): void => {
    if (typeof window === 'undefined') return

    try {
      // Limpar apenas chaves do app
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
    } catch (error) {
      console.error('Erro ao limpar storage:', error)
    }
  },

  // Verificar se existe
  has: (key: string): boolean => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(key) !== null
  },
}

// Hook para sincronização entre abas
export function useSyncStorage<T>(
  key: string,
  callback: (value: T | null) => void
) {
  if (typeof window === 'undefined') return

  const handleStorageUpdate = (event: Event) => {
    const customEvent = event as CustomEvent
    if (customEvent.detail.key === key) {
      callback(customEvent.detail.value)
    }
  }

  window.addEventListener('storage-update', handleStorageUpdate)
  
  // Também escutar eventos nativos de storage (outras abas)
  const handleNativeStorage = (event: StorageEvent) => {
    if (event.key === key && event.newValue) {
      try {
        callback(JSON.parse(event.newValue))
      } catch (error) {
        console.error('Erro ao processar storage event:', error)
      }
    }
  }

  window.addEventListener('storage', handleNativeStorage)

  return () => {
    window.removeEventListener('storage-update', handleStorageUpdate)
    window.removeEventListener('storage', handleNativeStorage)
  }
}
