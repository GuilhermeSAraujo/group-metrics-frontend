const DEFAULT_BASE = 'http://188.245.83.65:3030'

/**
 * @param {string} [baseUrl] - API origin (no trailing slash). Override with VITE_API_BASE_URL.
 * @returns {{ getJson: (endpoint: string) => Promise<unknown> }}
 */
function createApiClient(baseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_BASE) {
  const base = baseUrl.replace(/\/$/, '')

  return {
    async getJson(endpoint) {
      const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
      const res = await fetch(`${base}${path}`)
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      return res.json()
    },
  }
}

export const api = createApiClient();