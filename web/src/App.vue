<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(getPreferredTheme())

const applyTheme = (value: Theme) => {
  document.documentElement.classList.toggle('theme-dark', value === 'dark')
}

const toggleTheme = () => {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
}

onMounted(() => applyTheme(theme.value))
watch(theme, applyTheme)
</script>

<template>
  <div class="app-shell">
    <header class="top-bar">
      <div class="brand">
        <span class="dot"></span>
        <div>
          <p class="eyebrow">MVP Workspace</p>
          <h1>Voice → Polish → WhatsApp</h1>
        </div>
      </div>
      <button class="ghost" type="button" @click="toggleTheme">
        {{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}
      </button>
    </header>

    <main class="content">
      <section class="panel hero">
        <p class="eyebrow">Setup</p>
        <h2>Vue + TypeScript shell is ready.</h2>
        <p class="lede">
          Next steps: wire the recorder, upload audio to the backend, and show transcript and polished
          text. Dark mode and theming are baked in.
        </p>
        <div class="tags">
          <span class="tag">Vite</span>
          <span class="tag">Vue 3</span>
          <span class="tag">TypeScript</span>
          <span class="tag">Light/Dark</span>
        </div>
      </section>

      <section class="panel todo">
        <p class="eyebrow">Upcoming modules</p>
        <ul>
          <li>Recorder component (MediaRecorder) → FormData upload</li>
          <li>Recipient chooser + persistence</li>
          <li>Transcript + polished output panels</li>
          <li>WhatsApp deeplink generator</li>
        </ul>
      </section>
    </main>
  </div>
</template>
