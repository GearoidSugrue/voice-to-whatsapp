<script setup lang="ts">
import { computed } from 'vue'
import type { RecorderState } from '../types'
import { apiBaseUrl } from '../lib/apiConfig'
import { useDebugChecks } from '../composables/useDebugChecks'

const props = defineProps<{
  recorderState: RecorderState
  audioBlob: Blob | null
  apiError: string | null
  authToken: string
  debugModel?: string | null
}>()

const audioInfo = computed(() => {
  if (!props.audioBlob) return 'No audio captured'
  const sizeKb = Math.round((props.audioBlob.size / 1024) * 10) / 10
  return `${props.audioBlob.type || 'unknown'} · ${sizeKb} KB`
})

const selectedModel = computed(() => props.debugModel?.trim() || undefined)
const { checks, runModelsCheck, runTranscriptionCheck } = useDebugChecks(
  () => props.authToken,
  selectedModel.value,
)
</script>

<template>
  <section class="panel debug">
    <p class="eyebrow">Debug</p>
    <h3>Internal checks</h3>
    <p class="muted">Visible only when ?debug=true is set.</p>

    <ul class="list">
      <li><strong>Recorder state:</strong> {{ recorderState }}</li>
      <li><strong>Audio:</strong> {{ audioInfo }}</li>
      <li><strong>API base URL:</strong> {{ apiBaseUrl || '(same origin)' }}</li>
      <li v-if="apiError"><strong>Last API error:</strong> {{ apiError }}</li>
      <li v-else><strong>Last API error:</strong> none</li>
      <li><strong>Transcription model:</strong> {{ selectedModel || 'default (gpt-4o-transcribe)' }}</li>
    </ul>

    <div class="checks">
      <div class="check-row">
        <button type="button" class="btn btn-ghost" @click="runModelsCheck" :disabled="checks.models.state === 'loading'">
          {{ checks.models.state === 'loading' ? 'Checking…' : 'Ping OpenAI models' }}
        </button>
        <span class="status" :data-state="checks.models.state">{{ checks.models.message || 'Idle' }}</span>
      </div>
      <div class="check-row">
        <button
          type="button"
          class="btn btn-ghost"
          @click="runTranscriptionCheck(selectedModel || undefined)"
          :disabled="checks.transcription.state === 'loading'"
        >
          {{ checks.transcription.state === 'loading' ? 'Transcribing…' : 'Test transcription' }}
        </button>
        <span class="status" :data-state="checks.transcription.state">
          {{ checks.transcription.message || 'Idle' }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.debug {
  border: 1px dashed var(--border);
  background: rgba(125, 211, 252, 0.06);
}

.list {
  margin: 12px 0;
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.muted {
  color: var(--muted);
}

.checks {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.check-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.status {
  color: var(--muted);
  font-size: 14px;
}

.status[data-state='ok'] {
  color: #16a34a;
}

.status[data-state='error'] {
  color: #dc2626;
}
</style>
