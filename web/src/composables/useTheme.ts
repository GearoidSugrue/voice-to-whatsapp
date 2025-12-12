import { onMounted, ref, watch } from 'vue'

type Theme = 'light' | 'dark'

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const applyTheme = (value: Theme) => {
  document.documentElement.classList.toggle('theme-dark', value === 'dark')
}

export function useTheme() {
  const theme = ref<Theme>(getPreferredTheme())

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  onMounted(() => applyTheme(theme.value))
  watch(theme, applyTheme)

  return { theme, toggleTheme }
}
