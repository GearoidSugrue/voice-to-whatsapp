<script setup lang="ts">
import { computed, ref } from 'vue'
import RecorderPanel from './components/RecorderPanel.vue'
import RecipientChooser from './components/RecipientChooser.vue'
import OutputPanels from './components/OutputPanels.vue'
import type { RecorderState, TranscriptResult } from './types'
import { useTheme } from './composables/useTheme'
import { useRecorder } from './composables/useRecorder'
import { useRecipient } from './composables/useRecipient'
import { polishAudio } from './lib/apiClient'

const { theme, toggleTheme } = useTheme()
const { state: recorderState, audioBlob, error: recorderError, startRecording, stopRecording } =
  useRecorder()
const { recipient } = useRecipient()
const lastResult = ref<TranscriptResult>()
const authToken = ref('')
const isSubmitting = ref(false)
const apiError = ref<string | null>(null)

const canSubmit = computed(
  () =>
    !!audioBlob.value &&
    !!authToken.value.trim() &&
    recorderState.value !== 'recording' &&
    !isSubmitting.value,
)

const submitAudio = async () => {
  if (!audioBlob.value || !authToken.value) return
  apiError.value = null
  isSubmitting.value = true
  recorderState.value = 'processing' as RecorderState
  try {
    const file = new File([audioBlob.value], 'audio.webm', { type: audioBlob.value.type })
    const data = await polishAudio({ authToken: authToken.value, audio: file })
    lastResult.value = data
  } catch (err) {
    apiError.value = err instanceof Error ? err.message : 'Failed to send audio'
  } finally {
    isSubmitting.value = false
    recorderState.value = 'idle'
  }
}
</script>

<template>
  <div class="app-shell">
    <header class="top-bar">
      <div class="brand">
        <span class="dot"></span>
        <div>
          <p class="eyebrow">Prototype</p>
          <h1>Voice to text → Polish text → Open in WhatsApp</h1>
        </div>
      </div>
      <button class="ghost" type="button" @click="toggleTheme">
        {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
      </button>
    </header>

    <main class="content grid">
      <section class="panel auth">
        <p class="eyebrow">Auth</p>
        <h3>Polisher secret</h3>
        <p class="muted">Bearer token required for API calls.</p>
        <input v-model="authToken" type="password" name="auth" placeholder="POLISHER_SECRET" />
      </section>

      <RecorderPanel
        :state="recorderState"
        :can-submit="canSubmit"
        :is-submitting="isSubmitting"
        :error="recorderError"
        @start="startRecording"
        @stop="stopRecording"
        @submit="submitAudio"
      />
      <RecipientChooser v-model="recipient" />
      <OutputPanels :result="lastResult" :recipient="recipient" />

      <div v-if="apiError" class="panel alert">
        <p class="eyebrow">Error</p>
        <p>{{ apiError }}</p>
      </div>
    </main>
  </div>
</template>
