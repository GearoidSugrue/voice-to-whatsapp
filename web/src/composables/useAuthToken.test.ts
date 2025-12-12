import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { useAuthToken } from './useAuthToken'

describe('useAuthToken', () => {
  it('persists and restores from localStorage', async () => {
    const { authToken } = useAuthToken()
    authToken.value = 'secret-123'
    await nextTick()
    expect(localStorage.getItem('polisherSecret')).toBe('secret-123')

    // simulate new composable usage (restore)
    const { authToken: restored } = useAuthToken()
    await nextTick()
    expect(restored.value).toBe('secret-123')
  })
})
