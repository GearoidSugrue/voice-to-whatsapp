<script setup lang="ts">
import type { TranscriptResult } from '../types'

defineProps<{
  result?: TranscriptResult
}>()
</script>

<template>
  <section class="panel">
    <p class="eyebrow">Output</p>
    <h3>Transcript & polished text</h3>
    <div v-if="result" class="stack">
      <div class="card">
        <p class="label">Transcript</p>
        <p>{{ result.transcript }}</p>
      </div>
      <div class="card">
        <p class="label">Polished</p>
        <p>{{ result.polished }}</p>
      </div>
    </div>
    <p v-else class="muted">Awaiting an upload. Results will appear here.</p>
  </section>
</template>

<style scoped>
.stack {
  display: grid;
  gap: 12px;
}

.card {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.5);
}

.label {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 6px;
}

.muted {
  color: var(--muted);
}
</style>
