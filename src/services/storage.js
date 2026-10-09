const PREFIX = 'rms:'

export const storage = {
  read(key, fallback = null) {
    try {
      const raw = localStorage.getItem(PREFIX + key)
      return raw ? JSON.parse(raw) : fallback
    } catch {
      return fallback
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch (e) {
      console.warn('Storage write failed', e)
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key)
  },

  clearAll() {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  },
}