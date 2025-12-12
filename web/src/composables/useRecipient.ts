import { onMounted, ref, watch } from 'vue'

const STORAGE_KEY = 'favRecipient'

export function useRecipient() {
  const recipient = ref('')

  onMounted(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) recipient.value = stored
    } catch (_) {
      /* ignore storage errors */
    }
  })

  watch(
    recipient,
    (val) => {
      try {
        if (!val) {
          localStorage.removeItem(STORAGE_KEY)
        } else {
          localStorage.setItem(STORAGE_KEY, val)
        }
      } catch (_) {
        /* ignore storage errors */
      }
    },
    { flush: 'post' },
  )

  return { recipient }
}
