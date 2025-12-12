<script setup lang="ts">
import { computed } from 'vue'
import type { RecorderState } from '../types'

const props = defineProps<{
  state: RecorderState
  canSubmit: boolean
  isSubmitting: boolean
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
    default:
      return 'Idle'
  }
})
</script>

<template>
  <section class="panel recorder">
    <p class="eyebrow">Recorder</p>
    <h3>Capture a quick voice note</h3>
    <p class="muted">Click start to record, then stop to prepare the upload.</p>

    <div v-if="error" class="alert">{{ error }}</div>

    <div class="controls">
      <button class="primary" type="button" :disabled="state !== 'idle'" @click="emit('start')">
        {{ state === 'recording' ? 'Recording...' : 'Start recording' }}
      </button>
      <button class="ghost" type="button" :disabled="state !== 'recording'" @click="emit('stop')">
        Stop
      </button>
      <button class="ghost" type="button" :disabled="!canSubmit || isSubmitting" @click="emit('submit')">
        {{ isSubmitting ? 'Sending...' : 'Send for polish' }}
      </button>
    </div>

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

.primary {
  border: none;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #fff;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.2s ease;
}

.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.18);
}

.muted {
  color: var(--muted);
}

.status {
  margin-top: 12px;
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
