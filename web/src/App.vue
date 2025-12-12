<script setup lang="ts">
import { computed } from 'vue'
import RecorderPanel from './components/RecorderPanel.vue'
import RecipientChooser from './components/RecipientChooser.vue'
import OutputPanels from './components/OutputPanels.vue'
import type { RecorderState } from './types'
import { useTheme } from './composables/useTheme'
import { useRecorder } from './composables/useRecorder'
import { useRecipient } from './composables/useRecipient'
import { usePolisher } from './composables/usePolisher'
import { useAuthToken } from './composables/useAuthToken'

const { theme, toggleTheme } = useTheme()
const { state: recorderState, audioBlob, error: recorderError, transition } = useRecorder()
const { recipient } = useRecipient()
const { lastResult, isSubmitting, apiError, submit } = usePolisher()
const { authToken } = useAuthToken()

const isRecording = computed(() => recorderState.value === 'recording')
const isProcessing = computed(() => recorderState.value === 'processing')
const hasAudio = computed(() => !!audioBlob.value)
const hasAuth = computed(() => !!authToken.value.trim())

const submitAudio = async () => {
  if (!audioBlob.value || !authToken.value) return
  recorderState.value = 'processing' as RecorderState
  await submit(authToken.value, audioBlob.value)
  recorderState.value = 'idle'
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
        <p class="muted">
          Bearer token required for API calls. Saved locally for convenience.
        </p>
        <input v-model="authToken" type="password" name="auth" placeholder="POLISHER_SECRET" />
      </section>

      <RecorderPanel
        :state="recorderState"
        :has-audio="hasAudio"
        :has-auth="hasAuth"
        :is-submitting="isSubmitting"
        :is-recording="isRecording"
        :is-processing="isProcessing"
        :error="recorderError"
        @start="transition('START')"
        @stop="transition('STOP')"
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
