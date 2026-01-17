import { reactive } from 'vue'
import { apiBaseUrl } from '../lib/apiConfig'

type CheckKey = 'models' | 'transcription'
type CheckState = { state: 'idle' | 'loading' | 'ok' | 'error'; message: string }

export function useDebugChecks(getAuthToken: () => string) {
  const checks = reactive<Record<CheckKey, CheckState>>({
    models: { state: 'idle', message: '' },
    transcription: { state: 'idle', message: '' },
  })

  const runCheck = async (kind: CheckKey) => {
    const token = getAuthToken()
    if (!token) {
      checks[kind] = { state: 'error', message: 'Add POLISHER_SECRET first' }
      return
    }

    const endpoint =
      kind === 'models'
        ? `${(apiBaseUrl || '')}/health/openai`
        : `${(apiBaseUrl || '')}/health/openai/transcription`

    checks[kind] = { state: 'loading', message: 'Running…' }

    try {
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) {
        checks[kind] = { state: 'error', message: `HTTP ${res.status}` }
        return
      }
      const data = await res.json()
      const msg =
        kind === 'models'
          ? `Models: ${(data?.modelsSeen ?? []).join(', ') || 'none'}`
          : `Transcript: ${data?.transcript ?? '(empty)'}` // silent test should be empty
      checks[kind] = { state: 'ok', message: msg }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Request failed'
      checks[kind] = { state: 'error', message }
    }
  }

  return {
    checks,
    runModelsCheck: () => runCheck('models'),
    runTranscriptionCheck: () => runCheck('transcription'),
  }
}
