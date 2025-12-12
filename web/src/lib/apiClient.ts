import { apiBaseUrl } from './apiConfig'

export type PolishAudioResponse = {
  transcript: string
  polished: string
}

export type ApiError = {
  error: string
}
 
type RequestOptions = {
  signal?: AbortSignal
  authToken: string
  audio: File | Blob
}

/**
 * Prepare a multipart request for /polish-audio.
 * Caller supplies the audio blob/file and the auth token (POLISHER_SECRET).
 */
export async function polishAudio({ authToken, audio, signal }: RequestOptions) {
  const form = new FormData()
  form.append('audio', audio)

  const res = await fetch(`${apiBaseUrl}/polish-audio`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    body: form,
    signal,
  })

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    try {
      const data = (await res.json()) as ApiError
      if (data?.error) message = data.error
    } catch (_) {
      /* ignore parse errors */
    }
    throw new Error(message)
  }

  return (await res.json()) as PolishAudioResponse
}
