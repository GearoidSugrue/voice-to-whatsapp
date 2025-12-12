<script setup lang="ts">
import type { TranscriptResult } from '../types'
import { useWhatsappLink } from '../composables/useWhatsappLink'

const props = defineProps<{
  result?: TranscriptResult
  recipient: string
  error?: string | null
}>()

const whatsappLink = useWhatsappLink(props.recipient, props.result)
</script>

<template>
  <section class="panel">
    <p class="eyebrow">Output</p>
    <h3>Transcript & polished text</h3>

    <div v-if="error" class="error">
      <p class="label">Error</p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if="result" class="stack">
      <div class="card">
        <p class="label">Transcript</p>
        <p>{{ result.transcript }}</p>
      </div>
      <div class="card">
        <p class="label">Polished</p>
        <p>{{ result.polished }}</p>
      </div>
      <a v-if="whatsappLink" class="btn btn-primary link-cta" :href="whatsappLink" target="_blank" rel="noreferrer">
        Open in WhatsApp
      </a>
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

.link-cta {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
}

.error {
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid rgba(220, 38, 38, 0.4);
  background: rgba(239, 68, 68, 0.08);
  color: #dc2626;
}
</style>
