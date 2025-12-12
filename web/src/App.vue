<script setup lang="ts">
import { ref } from 'vue'
import RecorderPanel from './components/RecorderPanel.vue'
import RecipientChooser from './components/RecipientChooser.vue'
import OutputPanels from './components/OutputPanels.vue'
import type { RecorderState, TranscriptResult } from './types'
import { useTheme } from './composables/useTheme'

const { theme, toggleTheme } = useTheme()
const recorderState = ref<RecorderState>('idle')
const recipient = ref('')
const lastResult = ref<TranscriptResult>()
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
      <RecorderPanel :state="recorderState" />
      <RecipientChooser v-model="recipient" />
      <OutputPanels :result="lastResult" />
    </main>
  </div>
</template>
