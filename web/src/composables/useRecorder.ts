import { onBeforeUnmount, ref } from 'vue'
import type { RecorderState } from '../types'

export function useRecorder() {
  const state = ref<RecorderState>('idle')
  const audioBlob = ref<Blob | null>(null)
  const error = ref<string | null>(null)

  let mediaRecorder: MediaRecorder | null = null
  let chunks: BlobPart[] = []
  let stream: MediaStream | null = null

  const reset = () => {
    audioBlob.value = null
    error.value = null
    chunks = []
  }

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      error.value = 'Audio recording is not supported in this browser.'
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
      error.value = err instanceof Error ? err.message : 'Failed to access microphone.'
      stopStream()
    }
  }

  const stopRecording = () => {
    if (state.value !== 'recording') return
    state.value = 'processing'
    mediaRecorder?.stop()
  }

  const stopStream = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop())
      stream = null
    }
  }

  onBeforeUnmount(() => {
    stopRecording()
    stopStream()
  })

  return {
    state,
    audioBlob,
    error,
    startRecording,
    stopRecording,
    reset,
  }
}
