<script setup lang="ts">
import { computed } from 'vue'
import type { RecorderState } from '../types'

const props = defineProps<{
  state: RecorderState
  hasAudio: boolean
  hasAuth: boolean
  isSubmitting: boolean
  isRecording: boolean
  isProcessing: boolean
  error?: string | null
}>()

const emit = defineEmits<{
  (e: 'start'): void
  (e: 'stop'): void
  (e: 'submit'): void
}>()

const stateLabel = computed(() => {
  switch (props.state) {
    case 'recording':
      return 'Recording'
    case 'processing':
      return 'Processing'
    case 'error':
      return 'Error'
    default:
      return 'Idle'
  }
})

const sendLabel = computed(() => {
  if (props.isSubmitting) return 'Sending...'
  if (!props.hasAuth) return 'Add secret to send'
  return 'Send for polish'
})
</script>

<template>
  <section class="panel recorder">
    <p class="eyebrow">Recorder</p>
    <h3>Capture a quick voice note</h3>
    <p class="muted">Click start to record, then stop to prepare the upload.</p>

    <div v-if="error" class="alert">{{ error }}</div>

    <div class="controls">
      <button v-if="!isRecording && !isProcessing" class="btn btn-primary" type="button" @click="emit('start')">
        Start recording
      </button>
      <button v-if="isRecording" class="btn btn-ghost" type="button" @click="emit('stop')">
        Stop
      </button>
      <button
        v-if="hasAudio && !isRecording && !isProcessing"
        class="btn btn-ghost"
        type="button"
        :disabled="!hasAuth || isSubmitting"
        @click="emit('submit')"
      >
        {{ sendLabel }}
      </button>
    </div>

    <p v-if="hasAudio && !hasAuth" class="hint-text">
      <span>Add your secret to enable sending.</span>
    </p>

    <p class="status">
      Status:
      <strong>{{ stateLabel }}</strong>
    </p>
  </section>
</template>

<style scoped>
.recorder {
  border: 1px dashed var(--border);
}

.controls {
  margin-top: 16px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.muted {
  color: var(--muted);
}

.status {
  margin-top: 12px;
  color: var(--muted);
}

.hint-text {
  margin-top: 8px;
  color: var(--muted);
}

.alert {
  margin: 12px 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: rgba(239, 68, 68, 0.12);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.25);
}
</style>
