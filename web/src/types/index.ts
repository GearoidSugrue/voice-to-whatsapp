export type RecorderState = 'idle' | 'recording' | 'processing' | 'error'

export type TranscriptResult = {
  transcript: string
  polished: string
}

export type RecorderEvent = 'START' | 'STOP' | 'RESET' | 'FAIL'

export const recorderTransitions: Record<RecorderState, RecorderEvent[]> = {
  idle: ['START'],
  recording: ['STOP', 'FAIL'],
  processing: ['RESET', 'FAIL'],
  error: ['RESET'],
}
