import { describe, expect, it } from 'vitest'
import { http, HttpResponse } from 'msw'
import { mswServer } from '../setupTests'
import { polishAudio } from './apiClient'

const API_URL = 'http://localhost:9999'

describe('apiClient polishAudio', () => {
  it('sends multipart audio and returns parsed response', async () => {
    mswServer.use(
      http.post(`${API_URL}/polish-audio`, async ({ request }) => {
        const auth = request.headers.get('authorization')
        if (auth !== 'Bearer token123') {
          return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        return HttpResponse.json({
          transcript: 'hello',
          polished: 'Hello!',
        })
      }),
    )

    const blob = new Blob(['abc'], { type: 'audio/webm' })
    const result = await polishAudio({
      authToken: 'token123',
      audio: blob,
      signal: undefined,
      baseUrl: API_URL,
    })

    expect(result.transcript).toBe('hello')
    expect(result.polished).toBe('Hello!')
  })

  it('throws on non-ok response with error message', async () => {
    mswServer.use(
      http.post(`${API_URL}/polish-audio`, () =>
        HttpResponse.json({ error: 'Bad request' }, { status: 400 }),
      ),
    )
    const blob = new Blob(['abc'], { type: 'audio/webm' })
    await expect(
      polishAudio({
        authToken: 'token123',
        audio: blob,
        signal: undefined,
        baseUrl: API_URL,
      }),
    ).rejects.toThrow('Bad request')
  })
})
