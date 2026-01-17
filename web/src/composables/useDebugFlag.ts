import { computed } from 'vue'

export function useDebugFlag() {
  const isDebug = computed(() => {
    const params = new URLSearchParams(window.location.search)
    const flag = params.get('debug')
    return flag === 'true' || flag === '1'
  })

  return { isDebug }
}
