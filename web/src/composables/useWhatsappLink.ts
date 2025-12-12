import { computed } from 'vue'
import type { TranscriptResult } from '../types'

export function useWhatsappLink(recipient: string | undefined, result?: TranscriptResult) {
  return computed(() => {
    if (!result || !recipient) return ''
    const number = recipient.replace(/\s+/g, '')
    const encoded = encodeURIComponent(result.polished)
    return `https://wa.me/${number}?text=${encoded}`
  })
}
