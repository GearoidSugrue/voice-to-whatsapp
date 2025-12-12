<script setup lang="ts">
import type { RecorderState } from '../types'

defineProps<{
  state: RecorderState
}>()
</script>

<template>
  <section class="panel">
    <p class="eyebrow">Recorder</p>
    <h3>Capture a quick voice note</h3>
    <p class="muted">MediaRecorder wiring coming next; this is the shell.</p>

    <div class="controls">
      <button class="primary" type="button" :disabled="state !== 'idle'">Start recording</button>
      <button class="ghost" type="button" :disabled="state !== 'recording'">Stop</button>
    </div>
  </section>
</template>

<style scoped>
.panel {
  border: 1px dashed var(--border);
}

.controls {
  margin-top: 16px;
  display: flex;
  gap: 10px;
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
</style>
