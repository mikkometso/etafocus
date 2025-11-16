/**
 * Type-safe localStorage abstraction
 */

export const StorageKeys = {
  POMODORO_STATE: 'etafocus_pomodoro_state',
  POMODORO_SETTINGS: 'etafocus_pomodoro_settings',
  TODOS: 'etafocus_todos',
  THEME: 'etafocus_theme',
  STATISTICS: 'etafocus_statistics',
} as const

export class LocalStorage {
  /**
   * Get an item from localStorage
   */
  static get<T>(key: string): T | null {
    try {
      const item = window.localStorage.getItem(key)
      if (!item) return null

      return JSON.parse(item) as T
    } catch (error) {
      console.error(`Error getting item from localStorage: ${key}`, error)
      return null
    }
  }

  /**
   * Set an item in localStorage
   */
  static set<T>(key: string, value: T): void {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error setting item in localStorage: ${key}`, error)
    }
  }

  /**
   * Remove an item from localStorage
   */
  static remove(key: string): void {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing item from localStorage: ${key}`, error)
    }
  }

  /**
   * Clear all localStorage
   */
  static clear(): void {
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error('Error clearing localStorage', error)
    }
  }

  /**
   * Check if a key exists in localStorage
   */
  static has(key: string): boolean {
    return window.localStorage.getItem(key) !== null
  }
}
