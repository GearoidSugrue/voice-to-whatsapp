import { ref } from 'vue'
import type { TranscriptResult } from '../types'
import { polishAudio } from '../lib/apiClient'

export function usePolisher() {
  const lastResult = ref<TranscriptResult>()
  const isSubmitting = ref(false)
  const apiError = ref<string | null>(null)

  const submit = async (authToken: string, audio: Blob) => {
    if (!authToken || !audio) return
    apiError.value = null
    isSubmitting.value = true
    try {
      const file = new File([audio], 'audio.webm', { type: audio.type })
      const data = await polishAudio({ authToken, audio: file })
      lastResult.value = data
    } catch (err) {
      apiError.value = err instanceof Error ? err.message : 'Failed to send audio'
    } finally {
      isSubmitting.value = false
    }
  }

  return { lastResult, isSubmitting, apiError, submit }
}
