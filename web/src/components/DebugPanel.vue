<script setup lang="ts">
import { computed } from 'vue'
import type { RecorderState } from '../types'
import { apiBaseUrl } from '../lib/apiConfig'

const props = defineProps<{
  recorderState: RecorderState
  audioBlob: Blob | null
  apiError: string | null
}>()

const audioInfo = computed(() => {
  if (!props.audioBlob) return 'No audio captured'
  const sizeKb = Math.round((props.audioBlob.size / 1024) * 10) / 10
  return `${props.audioBlob.type || 'unknown'} · ${sizeKb} KB`
})
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
    </ul>

    <p class="muted small">
      Quick checks (requires Authorization header):
      <code>/health/openai</code> and <code>/health/openai/transcription</code>
    </p>
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

.small {
  font-size: 13px;
}

code {
  background: rgba(0, 0, 0, 0.04);
  padding: 2px 6px;
  border-radius: 6px;
  font-size: 12px;
}
</style>
