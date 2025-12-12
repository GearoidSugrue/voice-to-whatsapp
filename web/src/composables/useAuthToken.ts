import { onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'polisherSecret'

export function useAuthToken() {
  const authToken = ref('')

  onMounted(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) authToken.value = stored
    } catch (_) {
      /* ignore */
    }
  })

  watch(
    authToken,
    (val) => {
      try {
        if (val) {
          localStorage.setItem(STORAGE_KEY, val)
        } else {
          localStorage.removeItem(STORAGE_KEY)
        }
      } catch (_) {
        /* ignore */
      }
    },
    { flush: 'post' },
  )

  return { authToken }
}
