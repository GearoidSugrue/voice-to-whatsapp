import { onBeforeUnmount, ref } from 'vue'
import type { RecorderEvent, RecorderState } from '../types'
import { recorderTransitions } from '../types'

export function useRecorder() {
  const state = ref<RecorderState>('idle')
  const audioBlob = ref<Blob | null>(null)
  const error = ref<string | null>(null)

  let mediaRecorder: MediaRecorder | null = null
  let chunks: BlobPart[] = []
  let stream: MediaStream | null = null

  const transition = (event: RecorderEvent) => {
    const allowed = recorderTransitions[state.value]
    if (!allowed.includes(event)) {
      return
    }
    switch (state.value) {
      case 'idle':
        if (event === 'START') startInternal()
        break;
      case 'recording':
        if (event === 'STOP') stopInternal()
        if (event === 'FAIL') fail('Recording failed.')
        break;
      case 'processing':
        if (event === 'RESET') reset()
        if (event === 'FAIL') fail('Processing failed.')
        break;
      case 'error':
        if (event === 'RESET') reset()
        break;
    }
  }

  const startInternal = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      fail('Audio recording is not supported in this browser.')
      return
    }
    error.value = null
    reset()
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data)
        }
      }
      mediaRecorder.onstop = () => {
        audioBlob.value = new Blob(chunks, { type: mediaRecorder?.mimeType || 'audio/webm' })
        chunks = []
        state.value = 'idle'
        stopStream()
      }
      mediaRecorder.start()
      state.value = 'recording'
    } catch (err) {
      fail(err instanceof Error ? err.message : 'Failed to access microphone.')
      stopStream()
    }
  }

  const stopInternal = () => {
    if (state.value !== 'recording') return
    state.value = 'processing'
    mediaRecorder?.stop()
  }

  const reset = () => {
    audioBlob.value = null
    error.value = null
    chunks = []
    state.value = 'idle'
  }

  const fail = (message: string) => {
    error.value = message
    state.value = 'error'
    stopStream()
  }

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      stream = null
    }
  }

  onBeforeUnmount(() => {
    stopInternal()
    stopStream()
  })

  return {
    state,
    audioBlob,
    error,
    transition,
    reset,
  }
}
