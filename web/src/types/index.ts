export type RecorderState = 'idle' | 'recording' | 'processing'

export type TranscriptResult = {
  transcript: string
  polished: string
}
