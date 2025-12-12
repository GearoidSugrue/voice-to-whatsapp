<script setup lang="ts">
import { computed } from 'vue'
import type { TranscriptResult } from '../types'

const props = defineProps<{
  result?: TranscriptResult
  recipient: string
}>()

const whatsappLink = computed(() => {
  if (!props.result || !props.recipient) return ''
  const encoded = encodeURIComponent(props.result.polished)
  const number = props.recipient.replace(/\s+/g, '')
  return `https://wa.me/${number}?text=${encoded}`
})
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
      <a v-if="whatsappLink" class="cta" :href="whatsappLink" target="_blank" rel="noreferrer">
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

.cta {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent), var(--accent-strong));
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  width: fit-content;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.12);
}
</style>
