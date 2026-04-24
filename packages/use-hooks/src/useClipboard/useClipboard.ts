import { useToasts } from '@scalar/use-toasts'

import type { UseClipboardOptions } from './types'

/** Safely serialize a value to a string */
const serializeValue = (value: unknown) => {
  if (value === undefined) {
    return 'undefined'
  }
  if (typeof value === 'string') {
    return value
  }
  return JSON.stringify(value)
}

/**
 * A hook for interacting with the clipboard
 */
export function useClipboard(opts: UseClipboardOptions = {}) {
  const { notify, localeNotify } = opts
  const { toast } = useToasts()
  const effectiveNotify = notify ?? ((m: string) => toast(m, 'info'))

  async function copyToClipboard(value: unknown) {
    try {
      const serialized = serializeValue(value)
      await navigator.clipboard.writeText(serialized)
      const message = localeNotify ? localeNotify('copied') : 'Copied to the clipboard'
      effectiveNotify(message)
    } catch (e) {
      const error = e as Error
      console.error(error.message)
      const message = localeNotify ? localeNotify('failed') : 'Failed to copy to clipboard'
      effectiveNotify(message)
    }
  }

  return { copyToClipboard }
}
